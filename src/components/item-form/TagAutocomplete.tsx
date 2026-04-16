import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TagApiService, TagRow } from "../../services/tag-api-service";
import { ItemFormValues } from "./ItemForm";

type TagAutocompleteProps = {
  disabled?: boolean;
};

function parseCsv(csv: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of csv.split(",")) {
    const value = raw.trim();
    if (!value) {
      continue;
    }
    const key = value.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(value);
  }
  return result;
}

function splitCsvForEditing(csv: string) {
  const parts = csv.split(",");
  const current = (parts.pop() ?? "").trim();
  const entered = parts.map((p) => p.trim()).filter(Boolean);
  return { entered, current };
}

function replaceCurrentToken(csv: string, nextToken: string): string {
  const parts = csv.split(",");
  parts.pop();
  const base = parts.map((p) => p.trim()).filter(Boolean);
  return [...base, nextToken].join(", ");
}

export function TagAutocomplete({ disabled }: TagAutocompleteProps) {
  const form = useFormContext<ItemFormValues>();
  const [options, setOptions] = useState<TagRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const tags = await TagApiService.getTags();
        if (mounted) {
          setOptions(tags);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const tagsValue = form.watch("tags") ?? [];
  const tagsInputValue = form.watch("tags_input") ?? "";

  // Keep csv text in sync when form is initialized from existing tag ids.
  useEffect(() => {
    if ((tagsInputValue ?? "").trim().length > 0 || !tagsValue.length || !options.length) {
      return;
    }
    const byId = new Map(options.map((t) => [t.id, t.name]));
    const names = tagsValue.map((id) => byId.get(id)).filter((v): v is string => Boolean(v));
    if (names.length) {
      form.setValue("tags_input", names.join(", "), { shouldDirty: false });
    }
  }, [form, options, tagsInputValue, tagsValue]);

  const suggestionOptions = useMemo(() => {
    const { entered, current } = splitCsvForEditing(tagsInputValue);
    const enteredSet = new Set(entered.map((e) => e.toLowerCase()));
    const needle = current.toLowerCase();
    return options
      .filter((opt) => {
        const n = opt.name.toLowerCase();
        if (enteredSet.has(n)) {
          return false;
        }
        return needle.length === 0 || n.includes(needle);
      })
      .map((opt) => opt.name);
  }, [options, tagsInputValue]);

  return (
    <Controller
      name="tags_input"
      control={form.control}
      render={({ field }) => (
        <Autocomplete<string, false, false, true>
          freeSolo
          options={suggestionOptions}
          filterOptions={(x) => x}
          disabled={disabled}
          loading={loading}
          value={null}
          inputValue={field.value ?? ""}
          onInputChange={(_e, value) => {
            field.onChange(value);
            const parsed = parseCsv(value);
            const byName = new Map(options.map((t) => [t.name.toLowerCase(), t.id]));
            const ids = parsed
              .map((name) => byName.get(name.toLowerCase()))
              .filter((id): id is number => typeof id === "number");
            form.setValue("tags", ids, { shouldDirty: true });
          }}
          onChange={(_e, selected) => {
            if (!selected || typeof selected !== "string") {
              return;
            }
            const nextCsv = replaceCurrentToken(field.value ?? "", selected) + ", ";
            field.onChange(nextCsv);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags (comma separated)"
              placeholder="e.g. cat, fluffy, orange"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress size={18} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}
    />
  );
}

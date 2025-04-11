import React, { useState } from "react";
import { Box, Group, TextInput, Select, Checkbox, Button } from "@mantine/core";
import { IconClearAll, IconSearch } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";

interface FieldConfig {
    type: "text" | "select" | "checkbox" | "date";
    placeholder?: string;
    // initial value if needed
    value?: any;
    options?: string[] | { label: string; value: string }[];
    clearable?: boolean;
    searchable?: boolean;
    label?: string;
    minDate?: Date;
    maxDate?: Date;
}

interface DynamicSearchBarProps {
    fields: FieldConfig[];
    onSearch: (values: any[]) => void;
    onClear: () => void;
}

/**
 * Instead of using the provided field.value, we always reset to a "cleared" value
 * based on the field type. This ensures that the Clear button resets text and select fields.
 */
const getDefaultValue = (field: FieldConfig) => {
    switch (field.type) {
        case "checkbox":
            return false;
        case "select":
        case "date":
            return null;
        default:
            return "";
    }
};

export const DynamicSearchBar: React.FC<DynamicSearchBarProps> = ({ fields, onSearch, onClear }) => {
    // Local state is initialized using our getDefaultValue (ignoring provided value)
    const [localValues, setLocalValues] = useState<any[]>(() =>
        fields.map((field) => getDefaultValue(field))
    );

    const handleFieldChange = (index: number, value: any) => {
        setLocalValues((prev) => {
            const newValues = [...prev];
            newValues[index] = value;
            return newValues;
        });
    };

    const handleSearch = () => {
        // Trigger onSearch callback with current local values.
        onSearch(localValues);
    };

    const handleClear = () => {
        // Reset localValues to default cleared values.
        const clearedValues = fields.map((field) => getDefaultValue(field));
        setLocalValues(clearedValues);
        onClear();
    };

    return (
        <Box px="lg">
            <Group w={{ lg: "60%", sm: "100%" }}>
                {fields.map((field, index) => {
                    const commonProps = {
                        className: "w-full lg:w-1/4",
                        size: "xs" as const,
                        placeholder: field.placeholder,
                        value: localValues[index],
                    };

                    switch (field.type) {
                        case "text":
                            return (
                                <TextInput
                                    key={index}
                                    {...commonProps}
                                    onChange={(event) =>
                                        handleFieldChange(index, event.target.value)
                                    }
                                    leftSection={<IconSearch size={14} />}
                                />
                            );
                        case "select":
                            return (
                                <Select
                                    key={index}
                                    {...commonProps}
                                    data={field.options || []}
                                    clearable={field.clearable}
                                    // searchable={field.searchable}
                                    onChange={(value) => handleFieldChange(index, value)}
                                />
                            );
                        case "checkbox":
                            return (
                                <Checkbox
                                    key={index}
                                    label={
                                        <span className="font-semibold">
                                            {field.label}
                                        </span>
                                    }
                                    checked={localValues[index]}
                                    onChange={(event) =>
                                        handleFieldChange(
                                            index,
                                            event.currentTarget.checked
                                        )
                                    }
                                />
                            );
                        case "date":
                            return (
                                <DateInput
                                    key={index}
                                    {...commonProps}
                                    clearable
                                    minDate={field.minDate}
                                    maxDate={field.maxDate}
                                    onChange={(date) => handleFieldChange(index, date)}
                                />
                            );
                        default:
                            return null;
                    }
                })}
            </Group>
            <Group mt="md">
                <Button size="xs" onClick={handleSearch} leftSection={<IconSearch size="16"/>}>
                    Search
                </Button>
                <Button size="xs" variant="outline" onClick={handleClear} leftSection={<IconClearAll size="16"/>}>
                    Clear
                </Button>
            </Group>
        </Box>
    );
};

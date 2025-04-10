import React from "react";
import { Box, Group, TextInput, Select, Checkbox, Button } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";

interface FieldConfig {
    type: "text" | "select" | "checkbox" | "date";
    placeholder?: string;
    value?: any;
    options?: string[] | { label: string; value: string }[];
    onChange: (value: any) => void;
    clearable?: boolean;
    searchable?: boolean;
    label?: string;
    minDate?: Date;
    maxDate?: Date;
}

interface DynamicSearchBarProps {
    fields: FieldConfig[];
}

export const DynamicSearchBar: React.FC<DynamicSearchBarProps> = ({ fields }) => {
    return (
        <Box px="lg">
            <Group w={{ lg: "60%", sm: "100%" }}>
                {fields.map((field, index) => {
                    const commonProps = {
                        className: "w-full lg:w-1/4",
                        size: "xs" as const,
                        placeholder: field.placeholder,
                    };

                    switch (field.type) {
                        case "text":
                            return (
                                <TextInput
                                    key={index}
                                    {...commonProps}
                                    value={field.value}
                                    onChange={(event) => field.onChange(event.target.value)}
                                    rightSection={
                                        field.value ? (
                                            <IconX
                                                className="cursor-pointer"
                                                onClick={() => field.onChange("")}
                                                size={14}
                                            />
                                        ) : null
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
                                    searchable={field.searchable}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                />
                            );
                        case "checkbox":
                            return (
                                <Checkbox
                                    key={index}
                                    label={field.label}
                                    checked={field.value}
                                    onChange={() => field.onChange(!field.value)}
                                />
                            );
                        case "date":
                            return (
                                <DateInput
                                    key={index}
                                    {...commonProps}
                                    clearable
                                    value={field.value}
                                    minDate={field.minDate}
                                    maxDate={field.maxDate}
                                    onChange={(date) => field.onChange(date)}
                                />
                            );
                        default:
                            return null;
                    }
                })}
            </Group>
            {/*<Group mt="md">*/}
            {/*    <Button size="xs">Search</Button>*/}
            {/*    <Button size="xs" variant="outline" >Clear</Button>*/}
            {/*</Group>*/}
        </Box>
    );
};

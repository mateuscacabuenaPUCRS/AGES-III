import {
  Autocomplete,
  Checkbox,
  Chip,
  TextField,
  Box,
  ListItemText,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

type Style = "white" | "gray";

export interface Option {
  id: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  height?: string;
  placeholder: string;
  style: Style;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedOptions,
  onChange,
  style,
  height = "auto",
  placeholder,
}) => {
  const selectedObjects = options.filter((opt) =>
    selectedOptions.includes(opt.id)
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={options}
        value={selectedObjects}
        onChange={(_, value) => onChange(value.map((v) => v.id))}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option.label}
              {...getTagProps({ index })}
              size="small"
              sx={{
                backgroundColor: style === "white" ? "white" : "#F1F1F1",
                color: style === "white" ? "black" : "customText.black",
                fontWeight: 500,
                fontFamily: "Inter",
                border: "1px solid #c8c8c8",
                borderRadius: "10px",
                flexShrink: 0,
              }}
              deleteIcon={
                <CloseIcon
                  sx={{
                    fontSize: 20,
                    color: style === "white" ? "black" : "white",
                    borderRadius: "50%",
                    padding: "2px",
                  }}
                />
              }
            />
          ))
        }
        renderOption={(props, option, { selected }) => (
          <li
            {...props}
            style={{
              ...props.style,
              backgroundColor: "transparent",
            }}
          >
            <Checkbox
              checked={selected}
              size="small"
              sx={{
                padding: "4px 8px 4px 0",
                color: "customButton.gold",
                "&.Mui-checked": {
                  color: "customButton.gold",
                },
              }}
            />
            <ListItemText
              primary={option.label}
              primaryTypographyProps={{ sx: { fontSize: "0.875rem" } }}
            />
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder={selectedOptions.length === 0 ? placeholder : ""}
            fullWidth
            sx={{
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "customButton.lightGray",
              },
              "& label.Mui-focused": {
                color: "inherit",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "customButton.lightGray",
                  borderWidth: "1px",
                },
              "& .MuiOutlinedInput-root": {
                minHeight: height,
                display: "flex",
                alignItems: "center",
                "&:hover fieldset": {
                  borderColor: "customButton.lightGray",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "customButton.lightGray",
                },
                "& input": {
                  outline: "none",
                },
              },
            }}
          />
        )}
      />
    </Box>
  );
};

export default MultiSelect;

import { FilterType } from "../../enum/ViewSelectionFilterEnum";
import theme from "../../utils/theme";
import { Button, Stack } from "@mui/material";

interface Filter {
  label: string;
  value: FilterType;
}

interface ViewSelectionProps {
  filters: Filter[];
  selectedFilter: string;
  onChange: (valor: FilterType) => void;
}


const ViewSelectionFilter = ({
  filters,
  selectedFilter,
  onChange,
}: ViewSelectionProps) => {
  return (
    <Stack direction="row" gap={"0.5rem"} flexWrap="wrap">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={selectedFilter === filter.value ? "contained" : "outlined"}
          onClick={() => onChange(filter.value)}
          sx={{
            textTransform: "none",
            fontFamily: "Inter",
            fontWeight: selectedFilter === filter.value ? 600 : 400,
            fontSize: "14px",
            padding: "6px 20px",
            backgroundColor: selectedFilter === filter.value ? "customButton.gold" : "transparent",
            color: selectedFilter === filter.value
              ? "white"
              : theme.palette.customText.gray,
            borderColor: "#bababa",
          }}
        >
          {filter.label}
        </Button>
      ))}
    </Stack>
  );
};


export default ViewSelectionFilter;

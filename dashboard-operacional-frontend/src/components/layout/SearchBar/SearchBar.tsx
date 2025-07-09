import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import { Search as SearchIcon } from "@mui/icons-material";

interface SearchBarProps {
  placeholder: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  onSearchChange,
  value,
  ...rest
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        border: "1px solid #E3E3E3",
        borderRadius: 25,
        alignItems: "center",
        display: "flex",
        justifyItems: "center",
        width: "100%",
        padding: "0.25rem",
      }}
    >
      <InputBase
        {...rest}
        value={value}
        type="text"
        onChange={onSearchChange}
        placeholder={placeholder}
        inputProps={{ "aria-label": "search" }}
        sx={{
          width: "100%",
          paddingLeft: "1rem",
        }}
      ></InputBase>
      <SearchIcon
        sx={{
          marginRight: "0.5rem",
        }}
      />
    </Box>
  );
};

export default SearchBar;

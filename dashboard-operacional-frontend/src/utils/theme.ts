import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    customBackground: {
      primary: "#EEEEEE",
      secondary: "#F7F7F7",
      gray: "#8D8D8D",
      darkGray: "#1c1c1c",
      black: "#000000",
    },
    customButton: {
      primary: "#191919",
      white: "#FFFFFF",
      black: "#191919",
      gray: "#D3D3D3",
      gold: "#9E833B",
      lightGray: "#bfbfbf",
    },
    customText: {
      black: "#191919",
      gray: "#565656",
      lightGrey: "#8D8D8D",
      white: "#FFFFFF",
    },
    customInput: {
      primary: "#E3E3E3",
      white: "#FFFFFF",
      gray: "#A0AEC0",
      darkGrey: "#8D8D8D",
      lightGrey: "#D1D1D1",
      veryLightGray: "#EEEEEE",
      hover: "#9e833b",
    },
    icon: {
      black: "#000000",
      white: "#FFFFFF",
      gold: "#C1A047",
      gray: "#7A7474",
    },
    chart: {
      darkBrown: "#4A4331",
      reddishBrow: "#D6CFBF",
      oliveBrown: "#624F1C",
      mustardBrown: "#D6CFBF",
      goldenYellow: "#C1A047",
      lightBeige: "#D6CFBF",
      lightGray: "#D6CFBF",
    },
    hover: {
      primary: "#F5F5F5",
    },
    table: {
      primary: "#D9D9D9",
      white: "#FFFFFF",
      grey: "#f6f6f6",
      darkGrey: "#E7E7E7",
      lightGrey: "#F6F6F6",
    },
    suspectTable: {
      paleBeige: "#EFE5C9",
      mediumGray: "#F1F1F5",
      gold: "#C1A047",
      black: "#000000",
      white: "#F1F1F5",
    },
    border: {
      primary: "#E3E3E3",
    },
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    customBackground: {
      primary: string;
      secondary: string;
      gray: string;
      darkGray: string;
      black: string;
    };
    customButton: {
      primary: string;
      white: string;
      black: string;
      gray: string;
      gold: string;
      lightGray: string;
    };
    customText: {
      black: string;
      gray: string;
      lightGrey: string;
      white: string;
    };
    customInput: {
      primary: string;
      white: string;
      gray: string;
      darkGrey: string;
      lightGrey: string;
      veryLightGray: string;
      hover: string;
    };
    icon: {
      black: string;
      white: string;
      gold: string;
      gray: string;
    };
    suspectTable: {
      paleBeige: string;
      mediumGray: string;
      gold: string;
      black: string;
      white: string;
    };
    chart: {
      darkBrown: string;
      reddishBrow: string;
      oliveBrown: string;
      mustardBrown: string;
      goldenYellow: string;
      lightBeige: string;
      lightGray: string;
    };
    hover: {
      primary: string;
    };
    table: {
      primary: string;
      white: string;
      grey: string;
      darkGrey: string;
      lightGrey: string;
    };
    border: {
      primary: string;
    };
  }
  interface PaletteOptions {
    customBackground?: {
      primary?: string;
      secondary?: string;
      gray?: string;
      darkGray?: string;
      black?: string;
    };
    customButton: {
      primary: string;
      white: string;
      black: string;
      gray: string;
      gold: string;
      lightGray: string;
    };
    customText: {
      black: string;
      gray: string;
      lightGrey: string;
      white: string;
    };
    customInput: {
      primary: string;
      white: string;
      gray: string;
      darkGrey: string;
      lightGrey: string;
      veryLightGray: string;
      hover: string;
    };
    icon: {
      black: string;
      white: string;
      gold: string;
      gray: string;
    };
    chart: {
      darkBrown: string;
      reddishBrow: string;
      oliveBrown: string;
      mustardBrown: string;
      goldenYellow: string;
      lightBeige: string;
      lightGray: string;
    };
    hover: {
      primary: string;
    };
    table: {
      primary: string;
      white: string;
      grey: string;
      darkGrey: string;
      lightGrey: string;
    };
    suspectTable: {
      paleBeige: string;
      mediumGray: string;
      gold: string;
      black: string;
      white: string;
    };
    border: {
      primary: string;
    };
  }
}

export default theme;

import type { ColorScheme, MantineThemeOverride, Tuple } from "@mantine/core";

import { getStyles } from "./styles";

export const Black = "#000000";
export const White = "#ffffff";

export const theme: Record<ColorScheme, { dark: Tuple<string, 10>; primary: Tuple<string, 10> }> = {
    dark: {
        dark: [
            "#0c0809",
            "#181213",
            "#20191a",
            "#3d3032",
            "#58494b",
            "#756567",
            "#807274",
            "#a59394",
            "#dbcbce",
            "#faf8f8",
        ],
        primary: [
            "#04BFBF",
            "#038585",
            "#04acac",
            "#04BFBF",
            "#ebffff",
            "#04d2d2",
            "#3efbfb",
            "#64fcfc",
            "#b1fdfd",
            "#ebffff",
        ],
    },

    light: {
        dark: [
            "#faf8f8",
            "#f5f1f2",
            "#e2dede",
            "#c7c2c3",
            "#a7a1a2",
            "#968d8e",
            "#7c7475",
            "#3f3839",
            "#302829",
            "#1d1718",
        ],
        primary: [
            "#ebffff",
            "#b1fdfd",
            "#64fcfc",
            "#3efbfb",
            "#04d2d2",
            "#ebffff",
            "#04BFBF",
            "#04acac",
            "#038585",
            "#027272",
        ],
    },
};

export const getMantineTheme = (colorScheme: ColorScheme): MantineThemeOverride => ({
    black: colorScheme === "light" ? Black : White,
    colorScheme,
    colors: theme[colorScheme],
    defaultGradient: { deg: 180, from: theme.light.primary[5], to: theme.light.primary[7] },
    defaultRadius: "lg",
    fontFamily: `ExpletusSans, Helvetica, Arial,sans-serif !important`,
    globalStyles: getStyles,
    loader: "dots",
    primaryColor: "primary",
    white: colorScheme === "light" ? White : Black,
});

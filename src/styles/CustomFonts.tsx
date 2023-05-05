import { Global } from "@mantine/core";

export const CustomFonts = () => {
    return (
        <Global
            styles={[
                {
                    "@font-face": {
                        fontDisplay: "swap",
                        fontFamily: "ExpletusSans",
                        fontStyle: "normal",
                        src: `url('/PoppinsBold700.ttf') format("woff2")`,
                    },
                },
            ]}
        />
    );
};

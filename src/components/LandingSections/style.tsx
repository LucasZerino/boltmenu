import { createStyles, keyframes } from "@mantine/core";
import { spawn } from "child_process";
import { color } from "html2canvas/dist/types/css/types/color";

import { Black } from "src/styles/theme";

export const useStyles = createStyles((theme) => {
    const pulseAnimation = keyframes`
        0% { box-shadow: 0 0 0 0 ${theme.fn.rgba(theme.colors.primary[4], 0.5)}; }
        70% { box-shadow: 0 0 0 25px ${theme.fn.rgba(Black, 0.01)}; }
        100% { box-shadow: 0 0 0 0 ${theme.fn.rgba(Black, 0.01)}; }
    `;
    return {
        botaoConheca: {
            [`&:hover`]: {
                backgroundColor: "#04BFBF",
                color: "#FFF",
            },
            backgroundColor: "#FFF",
            border: "2px solid black",
            borderRadius: 50,
            padding: 10,
            transition: "all 0.5s ease",
        },
        botaoTeste: {
            [`&:hover`]: {
                border: "2px solid #00F444",
                color: "#333",
            },
            animation: `${pulseAnimation} 1s infinite`,
            backgroundColor: "#00F444",
            border: "2px solid black",
            borderRadius: 50,
            padding: 10,
            transition: "all 0.5s ease",
        },
        botoes: {
            [`@media (max-width: 700px)`]: {
                flexDirection: "column",
                fontSize: "13px !important",
                gap: 20,
            },
            [`@media (max-width: 850px)`]: {
                fontSize: 15,
                justifyContent: "center",
            },
            alignItems: "center",
            alignSelf: "center",
            display: "flex",
            flexDirection: "row",
            gap: 50,
            justifyContent: "space-between",
            left: 50,
        },
        card: {
            [`&:hover`]: { transform: "scale(1.03)" },
            background: theme.white,
            border: `1px solid ${theme.colors.dark[5]}`,
            transition: "transform 500ms ease",
        },
        cardIcon: {
            color: theme.colors.primary[4],
            height: 50,
            width: 50,
        },
        cardTitle: {
            "&::after": {
                backgroundColor: theme.fn.primaryColor(),
                content: '""',
                display: "block",
                height: 2,
                marginTop: theme.spacing.sm,
                width: 45,
            },
        },
        contactUsContainer: {
            width: 700,
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: { width: "100%" },
        },
        containerPt1: {
            [`@media (max-width: 1400px)`]: {
                marginLeft: "0px !important",
            },
            display: "flex",
            flexDirection: "column",
            marginLeft: "-100px",
            marginTop: "-100px",
            width: "70%",
        },
        containerStack: {
            [`@media (max-width: 1180px)`]: {
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
            },
            gap: 10,
            height: "100%",
            justifyContent: "center",
            padding: theme.spacing.xl,
            zIndex: 4,
        },
        containerSubtitle: {
            [`@media (max-width: 700px)`]: {
                display: "none",
            },
            [`@media (max-width: 850px)`]: {
                fontSize: 11,
                width: "100%",
            },
            color: "#51677a",
            fontSize: 16,
            marginTop: theme.spacing.md,
            textAlign: "center",
            width: "95%",
        },
        containerSubtitle2: {
            [`@media (max-width: 700px)`]: {
                color: "#51677a",
                display: "flex",
                fontSize: 16,
                marginTop: "-15px",
                textAlign: "center",
                width: "95%",
            },
            display: "none",
        },
        containerTitle: {
            "& > span": {
                backgroundColor: "#323F4B",
                borderRadius: 5,
                color: "#04BFBF",
                paddingLeft: "5px",
                paddingRight: "5px",
            },
            [`@media (max-width: 700px)`]: {
                fontSize: "25px !important",
            },
            [`@media (max-width: 850px)`]: {
                fontSize: 35,
                justifyContent: "center",
            },
            color: "#323F4B",
            fontSize: 36,
            fontWeight: "bold",
            marginBottom: theme.spacing.md,
            textAlign: "center",
        },
        description: {
            "&::after": {
                backgroundColor: theme.fn.primaryColor(),
                content: '""',
                display: "block",
                height: 2,
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: theme.spacing.sm,
                width: 45,
            },
            color: theme.black,
            margin: "auto",
            marginTop: theme.spacing.md,
            maxWidth: 600,
            opacity: 0.6,
            textAlign: "center",
        },
        getStartedButton: { animation: `${pulseAnimation} 2s ease-in-out infinite` },
        githubContent: {
            flexDirection: "column",
            height: "100%",
            padding: theme.spacing.md,
            textAlign: "center",
        },
        githubLink: {
            alignItems: "center",
            color: theme.colors.dark[6],
            display: "flex",
            fontSize: 20,
            fontWeight: "bold",
            gap: 16,
            marginBottom: theme.spacing.lg,
            [`@media (max-width: ${theme.breakpoints.lg}px)`]: { marginTop: theme.spacing.lg * 2 },
        },
        headerBg: {
            alignItems: "center !important",
            display: "flex !important",
            justifyContent: "center !important",
        },
        headerImg: {
            [`@media (max-width: 1180px)`]: {
                display: "none !important",
            },
            [`@media (max-width: 1400px)`]: {
                height: "500px !important",
                width: "550px !important",
            },
            [`@media (max-width: 1700px)`]: {
                height: "650px",
                width: "700px",
            },
            bottom: 0,
            height: "750px",
            position: "absolute",
            right: 0,
            width: "800px",
            zIndex: 1,
        },
        headerImg2: {
            [`@media (max-width: 1180px)`]: {
                display: "flex !important",
            },
            bottom: 0,
            display: "none",
            position: "absolute",
            right: 0,
            zIndex: 1,
        },
        parallaxBg: {
            alignItems: "center",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            display: "flex !important",
            justifyContent: "center",
            minHeight: "65vh",
            position: "relative",
        },
        parallaxText: {
            position: "relative",
            textAlign: "center",
            zIndex: 2,
        },
        sectionTitle: {
            "&::after": {
                backgroundColor: theme.fn.primaryColor(),
                content: '""',
                display: "block",
                height: 2,
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: theme.spacing.sm,
                width: 45,
            },
            color: theme.black,
            margin: "auto",
            marginBottom: theme.spacing.md,
            marginTop: theme.spacing.md,
            textAlign: "center",
            [theme.fn.smallerThan("sm")]: { fontSize: 28 },
        },
        stepIcon: { background: theme.white, borderColor: theme.colors.primary[4], color: theme.black },
        stepSeparator: { background: theme.black },
        stepperContents: { position: "relative", zIndex: 2 },
        stepperDesc: { color: theme.black, opacity: 0.7 },
        stepperLabel: { color: theme.black, opacity: 0.9 },
        stepperWrap: {
            borderRadius: theme.radius.lg,
            marginBottom: theme.spacing.xl * 2,
            marginLeft: theme.spacing.md,
            marginRight: theme.spacing.md,
            marginTop: theme.spacing.xl * 2,
            overflow: "hidden",
            padding: theme.spacing.lg,
            position: "relative",
        },
        title: {
            fontSize: 34,
            fontWeight: 900,
            [theme.fn.smallerThan("sm")]: { fontSize: 24 },
        },
        titleText: {
            fontSize: 90,
            textAlign: "center",
            [`@media (max-width: ${theme.breakpoints.lg}px)`]: { fontSize: 65 },
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: { fontSize: 45 },
        },
    };
});

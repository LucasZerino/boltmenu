import type { FC } from "react";

import { BackgroundImage, Box, Button, Container, Stack, Title, Transition } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { useStyles } from "./style";
import { LoginOptions } from "../LoginOptions";

export const Hero: FC = () => {
    const { classes, theme } = useStyles();
    const { status } = useSession();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
    const t = useTranslations("landing.hero");
    const tCommon = useTranslations("common");

    return (
        <BackgroundImage className={classes.headerBg} mih="calc(100vh - 60px)" src="/landing-hero-bg.svg">
            <Container h="100%" size="lg">
                <div className={classes.containerStack}>
                    <div className={classes.containerPt1}>
                        <h3 className={classes.containerTitle}>
                            Aumente as <span>vendas</span> do seu restaurante em até <span>30%</span> hoje com o{" "}
                            <span>cardápio digital</span> personalizável da Bolt
                        </h3>
                        <h4 className={classes.containerSubtitle}>
                            Com o Cardápio Digital personalizável da Bolt, você pode aumentar as vendas do seu
                            restaurante em até 30% hoje mesmo! Ofereça uma experiência de pedido conveniente e
                            personalizada aos seus clientes. Experimente gratuitamente por 7 dias!
                        </h4>
                        <h4 className={classes.containerSubtitle2}>
                            Ofereça uma experiência de pedido aos seus clientes.
                        </h4>
                        <div className={classes.botoes}>
                            <a className={classes.botaoTeste} href="auth/signin">
                                Teste 7 dias grátis
                            </a>
                            <a className={classes.botaoConheca} href="explore">
                                Conheça nossos clientes
                            </a>
                        </div>
                    </div>
                    <img
                        alt="Cliente feliz ao ver o cardápio digital da Bolt"
                        className={classes.headerImg}
                        src="/heroimg.png"
                    />
                    <img
                        alt="Cliente feliz ao ver o cardápio digital da Bolt"
                        className={classes.headerImg2}
                        src="/heroimg2.png"
                    />
                    <div />
                </div>
            </Container>
        </BackgroundImage>
    );
};

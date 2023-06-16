import type { FC } from "react";
import React, { useEffect, useMemo, useState } from "react";

import { Box, Button, createStyles, Stack, Text, useMantineTheme } from "@mantine/core";

import type { ModalProps } from "@mantine/core";
import type { Image, MenuItem } from "@prisma/client";

import { ImageKitImage } from "../ImageKitImage";
import { Modal } from "../Modal";

interface Props extends ModalProps {
    /** Menu item for which the modal needs to be displayed */
    menuItem?: MenuItem & { image: Image | null };
}

const useStyles = createStyles((theme) => ({
    addchart: {
        alignItems: "center",
        border: "2px solid #A1A09F",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "space-around",
        maxHeight: "30px",
        minWidth: "80px",
        outline: "none",
        padding: "0",
    },
    button: {
        border: "none",
        borderRight: "2px solid #A1A09F",
        color: "red",
        paddingRight: "5px",
    },
    button1: {
        borderLeft: "2px solid #A1A09F",
        color: "#54A776",
        paddingLeft: "5px",
    },
    description: {
        fontSize: "15px",
    },
    numberconter: {
        marginTop: "40px",
    },
    price: {
        color: "#4C986B",
        fontSize: "22px",
        marginTop: "40px",
    },
    stylebutton: {
        borderRadius: "5px",
        fontSize: "14px",
        maxHeight: "30px",
        maxWidth: "100px",
        padding: "0",
    },
    stylecart: {
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
    },
    teste: {
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
    },
}));

function generateRandomId() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 10;
    let randomId = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
    }

    return randomId;
}

const createVisitorId = () => {
    const visitorId = generateRandomId(); // Gere um ID aleatório aqui
    window.localStorage.setItem("visitorId", visitorId);
};

/** Modal to view details of a selected menu item */
export const ViewMenuItemModal: FC<Props> = ({ menuItem, ...rest }) => {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const [quantity, setQuantity] = useState(1);
    const bgColor = useMemo(() => {
        if (menuItem?.image?.color) {
            if (theme.colorScheme === "light") {
                return theme.fn.lighten(menuItem?.image?.color, 0.85);
            }
            return theme.fn.darken(menuItem?.image?.color, 0.85);
        }
        return theme.white;
    }, [menuItem?.image?.color, theme.colorScheme]);
    const handleAddToCart = () => {
        if (window.localStorage.getItem("visitorId")) {
            // O visitante já possui um ID
            const visitorId = window.localStorage.getItem("visitorId");
            console.log("Item adicionado ao carrinho com ID:", window.localStorage.getItem("visitorId"), {
                ...menuItem,
                quantity,
            });
        } else {
            // O visitante ainda não possui um ID
            try {
                createVisitorId();
                // Lógica para adicionar o item ao carrinho aqui
                console.log(
                    "Item adicionado ao carrinho:",
                    {
                        ...menuItem,
                        quantity,
                    },
                    "teste",
                    window.localStorage.getItem("visitorId")
                );
                // Adicione aqui qualquer feedback visual ou tratamento de sucesso
            } catch (error) {
                // Adicione aqui qualquer tratamento de erro ou feedback visual de falha
                console.error("Erro ao adicionar o item ao carrinho:", error);
            }
        }
    };
    return (
        <Modal
            centered
            data-testid="menu-item-card-modal"
            styles={{ modal: { background: bgColor } }}
            title={
                <Text color={theme.black} size="xl" weight="bold">
                    {menuItem?.name}
                </Text>
            }
            {...rest}
        >
            <Stack spacing="sm">
                {menuItem?.image?.path && (
                    <Box sx={{ borderRadius: theme.radius.lg, overflow: "hidden" }}>
                        <ImageKitImage
                            blurhash={menuItem?.image?.blurHash}
                            height={400}
                            imageAlt={menuItem?.name}
                            imagePath={menuItem?.image?.path}
                            width={400}
                        />
                    </Box>
                )}
                <div className={classes.teste}>
                    <h1 className={classes.price}> R$ {menuItem?.price} </h1>
                </div>
                <Text color={theme.black} opacity={0.6}>
                    {menuItem?.description}
                </Text>

                <div className={classes.stylecart}>
                    <Button className={classes.stylebutton} color="#039999" fullWidth onClick={handleAddToCart}>
                        Adicionar
                    </Button>
                    <div className={classes.addchart}>
                        <div
                            className={classes.button}
                            onClick={() => {
                                if (quantity > 1) {
                                    setQuantity(quantity - 1);
                                }
                            }}
                        >
                            -
                        </div>
                        <h1 className={classes.description}>{quantity}</h1>
                        <div className={classes.button1} onClick={() => setQuantity(quantity + 1)}>
                            +
                        </div>
                    </div>
                </div>
            </Stack>
        </Modal>
    );
};

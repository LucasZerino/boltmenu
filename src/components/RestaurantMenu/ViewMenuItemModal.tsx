import type { FC } from "react";
import React, { useEffect, useMemo, useState } from "react";

import { Box, Button, createStyles, Stack, Text, useMantineTheme } from "@mantine/core";
import { useQuery } from "react-query";

import type { ModalProps } from "@mantine/core";
import type { Image, MenuItem } from "@prisma/client";

import { api } from "src/utils/api";

import { ImageKitImage } from "../ImageKitImage";
import { Modal } from "../Modal";

interface Props extends ModalProps {
    /** Menu item for which the modal needs to be displayed */
    menuItem?: MenuItem & { image: Image | null };
}

function generateRandomId() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 10;
    let randomId = "";

    for (let i = 0; i < length; i += 1) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
    }
    return randomId;
}

const createVisitorId = () => {
    const visitorId = generateRandomId(); // Generate a random ID here
    window.localStorage.setItem("visitorId", visitorId);
    return visitorId;
};

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
        backgroundColor: "transparent",
        border: "none",
        borderRight: "2px solid #A1A09F",
        boxShadow: "none",
        color: "red",
        fontSize: "23px",
        paddingRight: "5px",
    },
    button1: {
        backgroundColor: "transparent",
        border: "none",
        borderLeft: "2px solid #A1A09F",
        boxShadow: "none",
        color: "#54A776",
        fontSize: "23px",
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

/** Modal to view details of a selected menu item */
export const ViewMenuItemModal: FC<Props> = ({ menuItem, ...rest }) => {
    const theme = useMantineTheme();
    const { classes } = useStyles();

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

    const { mutate } = api.cart.create.useMutation(); // Move a chamada do useMutation para o nível do componente

    const handleAddToCart = () => {
        const visitorId = window.localStorage.getItem("visitorId");

        if (visitorId) {
            console.log("Item adicionado ao carrinho com ID:", visitorId, {
                ...menuItem,
                quantity,
            });

            const createCart = async () => {
                try {
                    await mutate({
                        customerId: visitorId,
                    });
                    console.log("Carrinho criado!");
                } catch (error) {
                    console.error("Erro ao criar o carrinho:", error);
                }
            };

            const getCart = async () => {
                try {
                    const cart = await api.cart.get.useQuery({
                        cartId: visitorId,
                    });

                    console.log("Item adicionado ao carrinho com ID:", visitorId, {
                        ...menuItem,
                        quantity,
                    });
                    console.log("Itens do carrinho:", cart);

                    return cart; // Retorne o valor do carrinho
                } catch (error) {
                    console.error("Erro ao buscar o carrinho:", error);
                    return null; // Retorne `null` em caso de erro
                }
            };
            // http://localhost:3996/api/trpc/cart.create?batch=1

            getCart().then((cart) => {
                if (cart) {
                    // Carrinho já existe
                    console.log("Carrinho já existe!");
                    console.log("Item adicionado ao carrinho com ID:", visitorId, {
                        ...menuItem,
                        quantity,
                    });
                } else {
                    // Carrinho não existe, criar novo carrinho
                    createCart();
                }
            });
        } else {
            // O visitante ainda não possui um ID
            try {
                createVisitorId();
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
        <Modal centered data-testid="menu-item-card-modal" styles={{ modal: { background: bgColor } }} {...rest}>
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
                        <button
                            className={classes.button}
                            onClick={() => {
                                if (quantity > 1) {
                                    setQuantity(quantity - 1);
                                }
                            }}
                            type="button"
                        >
                            -
                        </button>
                        <h1 className={classes.description}>{quantity}</h1>
                        <button className={classes.button1} onClick={() => setQuantity(quantity + 1)} type="button">
                            +
                        </button>
                    </div>
                </div>
            </Stack>
        </Modal>
    );
};

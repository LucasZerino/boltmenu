import type { FC } from "react";
import React, { useEffect, useMemo, useState } from "react";

import { Box, Button, createStyles, Stack, Text, useMantineTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider, useMutation, useQuery } from "react-query";

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
    const queryClient = new QueryClient();
    const theme = useMantineTheme();
    const { classes } = useStyles();

    const [quantity, setQuantity] = useState(1);
    const [showNotification, setShowNotification] = useState(false);

    const showNotificationWithTimeout = () => {
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 2000);
    };

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
    const { mutate: addToCartMutate } = api.cart.addItem.useMutation(); // Adiciona item ao carrinho
    const { mutate: editQuantity } = api.cartItem.editQuantity.useMutation(); // Edita a quantidade de um item no carrinho
    const visitorId = typeof window !== "undefined" ? window.localStorage.getItem("visitorId") : null;
    const { data: userCart, refetch: refetchUserCart } = api.cart.get.useQuery(
        {
            cartId: visitorId as string,
        },
        {
            enabled: !!visitorId, // Ativa a query somente se o visitorId estiver disponível
        }
    );

    const { data: cartItems, refetch: refetchCartItems } = api.cartItem.getAll.useQuery({
        cartId: userCart?.id as string, // Use o ID do carrinho obtido em userCart
    });

    const handleAddToCart = async () => {
        const createCart = async () => {
            // Função para criar um carrinho
            try {
                await mutate({
                    customerId: visitorId ?? "",
                });
                await Promise.all([refetchUserCart(), refetchCartItems()]); // Aguarda o refetch dos dados do carrinho
                console.log("Carrinho criado!");
            } catch (error) {
                console.error("Erro ao criar o carrinho:", error);
            }
        };

        const addToCart = async () => {
            const itens = menuItem;
            const quantidade = quantity;
            const donoCarrinho = visitorId;
            const idItemMenu = itens?.id;

            console.log("Quantidade: ", quantidade, "\nDono do carrinho: ", donoCarrinho, "\nId do item: ", idItemMenu);
            console.log(cartItems, "esse é o cartItems");

            try {
                console.log("Item adicionado ao carrinho!", visitorId);
                await addToCartMutate({
                    customerId: donoCarrinho ?? "",
                    menuItemId: idItemMenu ?? "",
                    ownerId: visitorId ?? "",
                    quantity: quantidade ?? "",
                });
                showNotificationWithTimeout();
            } catch (error) {
                console.error("Erro ao adicionar item no carrinho:", error);
            }
        };

        const editarQuantidade = async () => {
            try {
                const cartItem = cartItems?.find((item) => item.menuItemId === menuItem?.id);
                const quantidade = cartItem ? cartItem.quantity + quantity : quantity;
                await editQuantity({
                    cartId: userCart?.id ?? "",
                    menuItemId: menuItem?.id ?? "",
                    quantity: quantidade,
                });
                await Promise.all([refetchUserCart(), refetchCartItems()]);
            } catch (error) {
                console.error("Erro ao editar a quantidade de itens", error);
            }
        };

        // Devo verificar se o visitante tem um ID
        if (visitorId) {
            // Caso o visitante tenha um ID
            console.log("O visitante tem um ID");
            if (userCart) {
                console.log("O visitante já tem um carrinho");
                console.log("Devo adicionar um item ao carrinho");
                if (cartItems !== undefined && cartItems.length > 0) {
                    console.log("Devo apenas alterar a quantidade do item no carrinho");
                    await editarQuantidade();
                } else {
                    console.log("Devo adicionar um item ao carrinho");
                    setTimeout(async () => {
                        await addToCart(); // Adiciona o item ao carrinho
                    }, 2000);
                }
                setQuantity(1); // Volta quantidade para 1
            } else {
                console.log("Tive que criar um carrinho para o visitante");
                console.log(userCart);
                await createCart(); // Cria o carrinho do visitante
                await Promise.all([refetchUserCart(), refetchCartItems()]); // Aguarda o refetch dos dados do carrinho
                console.log("Devo adicionar um item ao carrinho");
                setTimeout(async () => {
                    await addToCart(); // Adiciona o item ao carrinho
                }, 2000);
                setQuantity(1); // Volta quantidade para 1
            }
        } else {
            console.log("O visitante não tem um ID");
            // Caso o visitante não tenha um ID
            await createVisitorId(); // É criado o ID do visitante
            // Verifica se já existe um carrinho com esse ID
            if (userCart) {
                console.log("O visitante já tem um carrinho");
                setTimeout(async () => {
                    await addToCart(); // Adiciona o item ao carrinho
                }, 2000);
                console.log("Devo adicionar um item ao carrinho");
                setQuantity(1); // Volta quantidade para 1
            } else {
                console.log("Tive que criar um carrinho para o visitante");
                console.log(userCart);
                setTimeout(async () => {
                    await createCart(); // Cria o carrinho do visitante
                }, 2000);
                await Promise.all([refetchUserCart(), refetchCartItems()]); // Aguarda o refetch dos dados do carrinho
                console.log("Devo adicionar um item ao carrinho");
                setTimeout(async () => {
                    await addToCart(); // Adiciona o item ao carrinho
                }, 2000);
                setQuantity(1); // Volta quantidade para 1
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

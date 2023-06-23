import React, { useEffect, useMemo, useState } from "react";

import {
    ActionIcon,
    Box,
    Container,
    createStyles,
    Flex,
    MediaQuery,
    SimpleGrid,
    Stack,
    Tabs,
    Text,
    useMantineColorScheme,
} from "@mantine/core";
import { IconBackhoe, IconClipboardList, IconMenu, IconMenuOrder, IconShoppingCart, IconTrashX } from "@tabler/icons";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { NextSeo } from "next-seo";
import superjson from "superjson";

import type { GetStaticPropsContext, NextPage } from "next";

import { IconCard, ImageCard } from "src/components/Cards";
import { Empty } from "src/components/Empty";
import { Footer } from "src/components/Footer";
import { RestaurantMenu } from "src/components/RestaurantMenu";
import { env } from "src/env/client.mjs";
import { appRouter } from "src/server/api/root";
import { createInnerTRPCContext } from "src/server/api/trpc";
import { api } from "src/utils/api";

const useStyles = createStyles((theme) => ({
    carrinho: {
        alignSelf: "flex-start",
        color: "#535254",
        fontSize: "15px",
        marginBottom: "0px",
        marginLeft: "20px",
        marginTop: "50px",
    },
    iconX: {
        cursor: "pointer",
    },
    itens: {
        alignItems: "center",
        borderBottom: "2px solid #9AA5B1",
        display: "flex",
        justifyContent: "space-around",
        minWidth: "100%",
    },
    itensh1: {
        color: "#1F2933",
        fontSize: "17px",
    },
    itensh2: {
        alignItems: "center",
        color: "#1F2933",
        display: "flex",
        fontSize: "17px",
        gap: "8px",
    },
    itensh3: {
        color: "#1F2933",
        fontSize: "17px",
    },
    limparCart: {
        backgroundColor: "green",
        border: "none",
        borderRadius: "5px",
        color: "white",
        cursor: "pointer",
        display: "inline-block",
        fontSize: "16px",
        fontWeight: "bold",
        marginTop: "30px",
        padding: "15px 32px",
        textAlign: "center",
        textDecoration: "none",
    },
    linha: {
        background: "#9AA5B1",
        height: "2px",
        margin: "0",
        width: "100%",
    },
    obsText: {
        fontSize: "15px",
        marginTop: "50px",
    },
    resumo: {
        alignItems: "center",
        background: "#039999",
        bottom: "0",
        cursor: "pointer",
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        left: "0",
        position: "fixed",
        width: "100%",
    },
    resumoContainer: {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingTop: "50px",
    },
    resumoTexto: {
        color: "white",
        fontSize: "18px",
        textAlign: "center",
    },
    resumoTexto2: {
        color: "white",
        fontSize: "18px",
        textAlign: "center",
    },
    resumoTitle: {
        color: "#535254",
    },
    textarea: {
        backgroundColor: "#f8f8f8",
        border: "2px solid #ccc",
        borderRadius: "4px",
        boxSizing: "border-box",
        fontSize: "16px",
        height: "150px",
        resize: "none",
    },
    txtarea: {
        display: "flex",
        flexDirection: "column",
        maxWidth: "90%",
    },
}));

/** Restaurant menu page that will be shared publicly */
const RestaurantMenuPage: NextPage = () => {
    const router = useRouter();
    const { status } = useSession();
    const restaurantId = router.query?.restaurantId as string;
    const t = useTranslations("menu");
    const { data: restaurant } = api.restaurant.getDetails.useQuery(
        { id: restaurantId },
        { enabled: status === "authenticated" && !!restaurantId }
    );

    const [showCart, setShowCart] = useState(true);
    const [showResumo, setShowResumo] = useState(false);
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

    const { classes, theme } = useStyles();

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

    const { mutate } = api.cart.create.useMutation();

    const createCart = async (item: string) => {
        // Função para criar um carrinho com um item
        try {
            await mutate({
                customerId: item ?? "",
            });
            await refetchUserCart();
            await refetchCartItems();
        } catch (error) {
            console.error("Erro ao criar o carrinho:", error);
        }
    };

    useEffect(() => {
        const fetchVisitorData = async () => {
            const visitorId = typeof window !== "undefined" ? window.localStorage.getItem("visitorId") : null;
            const userCartData = await refetchUserCart(); // Aguarde a conclusão da chamada para atualizar o valor de userCart
            const userCart = userCartData.data; // Supondo que o valor seja retornado em userCartData.data

            if (!visitorId) {
                const generatedVisitorId = generateRandomId(); // Gere um ID aleatório aqui
                if (typeof window !== "undefined") {
                    window.localStorage.setItem("visitorId", generatedVisitorId);
                }
            }

            const updatedVisitorId = typeof window !== "undefined" ? window.localStorage.getItem("visitorId") : null;

            if (updatedVisitorId) {
                const updatedUserCartData = await refetchUserCart(); // Aguarde a conclusão da chamada para atualizar o valor de userCart
                const updatedUserCart = updatedUserCartData.data; // Supondo que o valor seja retornado em updatedUserCartData.data

                if (!updatedUserCart) {
                    setTimeout(async () => {
                        await createCart(updatedVisitorId); // Cria o carrinho do visitante
                        setTimeout(async () => {
                            await refetchUserCart();
                            const updatedCartData = await refetchCartItems(); // Recarrega tudo
                            const updatedCart = updatedCartData.data; // Supondo que o valor seja retornado em updatedCartData.data
                        }, 2000);
                    }, 3000);
                }
            }
        };

        fetchVisitorData();
    }, []);

    const [observacoes, setObservacoes] = useState("");

    const handleShowResumo = () => {
        setShowResumo(true);
        refetchCartItems();
        refetchUserCart(); // Atualiza o carrinho
    };

    const { mutate: removeCartItem } = api.cartItem.remove.useMutation();
    const { mutate: clearCarrinho } = api.cartItem.removeAll.useMutation();

    const removerItemdoCarrinho = async (itemId: string) => {
        try {
            await removeCartItem({
                cartItemId: itemId,
            });
            await refetchUserCart();
            await refetchCartItems();
        } catch (error) {
            console.error("Erro ao remover Item", error);
        }
    };

    const limparCarrinho = async (itemId: string) => {
        try {
            await clearCarrinho({
                cartId: itemId,
            });
            await refetchUserCart();
            await refetchCartItems();
        } catch (error) {
            console.error("Erro ao Limpar Carrinho Item", error);
        }
    };

    return (
        <>
            {!showResumo && (
                <>
                    <NextSeo
                        description={`${t("seoDescription.restaurantName", { name: restaurant?.name })}. ${t(
                            "seoDescription.restaurantLocation",
                            { location: restaurant?.location }
                        )}${
                            restaurant?.contactNo
                                ? t("seoDescription.restaurantContactNo", { contactNo: restaurant?.contactNo })
                                : ""
                        } ${t("seoDescription.menufic")}`}
                        openGraph={{
                            images: [{ url: `${env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${restaurant?.image?.path}` }],
                            type: "restaurant.menu",
                        }}
                        themeColor={restaurant?.image?.color}
                        title={t("seoTitle", { name: restaurant?.name })}
                    />
                    <main>
                        <Container py="lg" size="xl">
                            {restaurant && restaurant?.isPublished === true ? (
                                <RestaurantMenu restaurant={restaurant} />
                            ) : (
                                <Empty height="calc(100vh - 100px)" text={t("noDetailsAvailable")} />
                            )}
                        </Container>
                    </main>
                    {showCart && (
                        <Box>
                            <div
                                className={classes.resumo}
                                onClick={handleShowResumo}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        setShowResumo(true);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                            >
                                <h1 className={classes.resumoTexto}>Ver resumo</h1>
                                <IconShoppingCart color="white" />
                            </div>
                        </Box>
                    )}
                    {!showCart && <Footer />}
                </>
            )}
            {showResumo && (
                <div className={classes.resumoContainer}>
                    <div className={classes.resumoTitle}>
                        Resumo do pedido <br />
                        {restaurant?.name}
                    </div>
                    <h1 className={classes.carrinho}>Itens escolhidos</h1>
                    <div className={classes.linha} />
                    {cartItems?.map((item) => (
                        <div key={item.id} className={classes.itens}>
                            <h1 className={classes.itensh1}>{item?.itemName}</h1>
                            <h1 className={classes.itensh3}>-</h1>
                            <h2 className={classes.itensh2}>
                                x{item?.quantity}
                                <IconTrashX
                                    className={classes.iconX}
                                    color="red"
                                    onClick={() => removerItemdoCarrinho(item?.id)}
                                />
                            </h2>
                        </div>
                    ))}
                    <div>
                        <button
                            className={classes.limparCart}
                            onClick={() => userCart && limparCarrinho(userCart.id)}
                            type="button"
                        >
                            Limpar Resumo
                        </button>
                    </div>
                    <div className={classes.txtarea}>
                        <h1 className={classes.obsText}>Observações:</h1>
                        <textarea
                            className={classes.textarea}
                            cols={50}
                            onChange={(e) => setObservacoes(e.target.value)}
                            rows={4}
                            value={observacoes}
                        />
                    </div>
                    <div
                        className={classes.resumo}
                        onClick={() => setShowResumo(false)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                setShowResumo(false);
                            }
                        }}
                        role="button"
                        tabIndex={0}
                    >
                        <h1 className={classes.resumoTexto2}>Voltar para o menu</h1>
                        <IconClipboardList color="white" />
                    </div>
                </div>
            )}
        </>
    );
};

export async function getStaticProps(context: GetStaticPropsContext<{ restaurantId: string }>) {
    const ssg = createProxySSGHelpers({
        ctx: createInnerTRPCContext({ session: null }),
        router: appRouter,
        transformer: superjson,
    });
    const restaurantId = context.params?.restaurantId as string;
    const messages = (await import("src/lang/en.json")).default;
    try {
        const restaurant = await ssg.restaurant.getDetails.fetch({ id: restaurantId });
        if (restaurant.isPublished) {
            // Only return restaurants that are published
            return { props: { messages, restaurantId, trpcState: ssg.dehydrate() }, revalidate: 1800 }; // revalidate in 30 mins
        }
        return { props: { messages, restaurantId }, revalidate: 60 };
    } catch {
        return { props: { messages, restaurantId }, revalidate: 1800 };
    }
}

export const getStaticPaths = async () => ({ fallback: "blocking", paths: [] });

export default RestaurantMenuPage;

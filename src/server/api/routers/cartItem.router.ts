import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "src/server/api/trpc";

export const cartItemRouter = createTRPCRouter({
    /** Editar a quantidade de um item no carrinho */
    editQuantity: publicProcedure
        .input(
            z.object({
                cartId: z.string(),
                menuItemId: z.string(),
                quantity: z.number().positive(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { cartId, quantity, menuItemId } = input;

            const cartItem = await ctx.prisma.cartItem.findFirst({
                where: {
                    cartId,
                    menuItemId,
                },
            });

            if (!cartItem) {
                throw new Error("Item do carrinho não encontrado");
            }

            const updatedCartItem = await ctx.prisma.cartItem.update({
                data: {
                    quantity,
                },
                where: {
                    id: cartItem.id,
                },
            });

            return updatedCartItem;
        }),

    /** Obter todos os itens do carrinho */
    getAll: publicProcedure.input(z.object({ cartId: z.string() })).query(async ({ ctx, input }) => {
        const { cartId } = input;

        const cartItems = await ctx.prisma.cartItem.findMany({
            where: {
                cartId,
            },
        });

        return cartItems;
    }),

    /** Remover um item do carrinho */
    remove: publicProcedure
        .input(
            z.object({
                cartItemId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { cartItemId } = input;

            const cartItem = await ctx.prisma.cartItem.findUnique({
                where: {
                    id: cartItemId,
                },
            });

            if (!cartItem) {
                throw new Error("Item do carrinho não encontrado");
            }

            await ctx.prisma.cartItem.delete({
                where: {
                    id: cartItemId,
                },
            });

            return true;
        }),

    /** Remover todos os itens do carrinho */
    removeAll: publicProcedure.input(z.object({ cartId: z.string() })).mutation(async ({ ctx, input }) => {
        const { cartId } = input;

        await ctx.prisma.cartItem.deleteMany({
            where: {
                cartId,
            },
        });

        return true;
    }),
});

export default cartItemRouter;

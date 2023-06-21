import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "src/server/api/trpc";

export const cartRouter = createTRPCRouter({
    /** Adicionar um item ao carrinho */
    addItem: protectedProcedure
        .input(
            z.object({
                customerId: z.string(),
                menuItemId: z.string(),
                ownerId: z.string(),
                quantity: z.number().positive(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { customerId, menuItemId, quantity, ownerId } = input;

            const cart = await ctx.prisma.cart.findUnique({
                where: {
                    customerId,
                },
            });

            if (!cart) {
                throw new Error("Carrinho não encontrado");
            }

            const item = await ctx.prisma.menuItem.findUnique({
                where: {
                    id: menuItemId,
                },
            });

            if (!item) {
                throw new Error("Item não encontrado");
            }

            const existingCartItem = await ctx.prisma.cartItem.findFirst({
                where: {
                    cartId: cart.id,
                    menuItemId: item.id,
                },
            });

            if (existingCartItem) {
                throw new Error("Item já existe no carrinho");
            }

            const data = {
                cartId: cart.id,
                menuItemId: item.id,
                ownerId,
                quantity,
            };

            const createdCartItem = await ctx.prisma.cartItem.create({
                data,
            });

            return createdCartItem;
        }),

    /** Criar um carrinho */
    create: protectedProcedure.input(z.object({ customerId: z.string() })).mutation(async ({ ctx, input }) => {
        if (!input.customerId) {
            throw new Error("ID do cliente não fornecido");
        }

        const existingCart = await ctx.prisma.cart.findFirst({
            where: {
                customerId: input.customerId,
            },
        });

        if (existingCart) {
            throw new Error("Carrinho já existe");
        }

        const createdCart = await ctx.prisma.cart.create({
            data: {
                customerId: input.customerId,
            },
        });

        return createdCart;
    }),

    /** Excluir um carrinho */
    delete: protectedProcedure.input(z.object({ cartId: z.string() })).mutation(async ({ ctx, input }) => {
        const cart = await ctx.prisma.cart.findUnique({
            where: {
                id: input.cartId,
            },
        });

        if (!cart) {
            throw new Error("Carrinho não encontrado");
        }

        await ctx.prisma.cart.delete({
            where: {
                id: input.cartId,
            },
        });

        return true;
    }),

    /** Obter um carrinho */
    get: publicProcedure.input(z.object({ cartId: z.string() })).query(async ({ ctx, input }) => {
        const cart = await ctx.prisma.cart.findUnique({
            where: {
                customerId: input.cartId,
            },
        });

        if (!cart) {
            throw new Error("Carrinho não encontrado");
        }

        return cart;
    }),
});

export default cartRouter;

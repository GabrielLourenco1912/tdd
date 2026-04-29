const axios = require('axios');
require('dotenv').config();
const api = `http://localhost:${process.env.PORT || 3000}`;

describe("Usuários", () => {
    test("deve retornar uma lista de usuários", async () => {
        expect.assertions(2);
        const res = await axios.get(`${api}/usuarios`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.data)).toBe(true);
    });

    test("deve retornar um usuário pelo id", async () => {
        expect.assertions(4);
        const usuario = await axios.post(`${api}/usuarios`, {
            nome: "João Silva",
            email: `joao_${Date.now()}@email.com`,
            senha: "123456",
            tipo: "aluno",
        });
        const res = await axios.get(`${api}/usuarios/${usuario.data.id}`);
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("id");
        expect(res.data).toHaveProperty("nome");
        expect(res.data).toHaveProperty("email");
    });

    test("deve retornar 404 para usuário inexistente", async () => {
        expect.assertions(1);
        try {
            await axios.get(`${api}/usuarios/99999`);
        } catch (err) {
            expect(err.response.status).toBe(404);
        }
    });

    test("deve criar um novo usuário", async () => {
        expect.assertions(4);
        const res = await axios.post(`${api}/usuarios`, {
            nome: "João Silva",
            email: `joao_${Date.now()}@email.com`,
            senha: "123456",
            tipo: "aluno",
        });
        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty("id");
        expect(res.data.nome).toBe("João Silva");
        expect(res.data.tipo).toBe("aluno");
    });

    test("deve retornar 400 ao criar usuário sem nome", async () => {
        expect.assertions(1);
        try {
            await axios.post(`${api}/usuarios`, {
                email: "joao@email.com",
                senha: "123456",
                tipo: "aluno",
            });
        } catch (err) {
            expect(err.response.status).toBe(400);
        }
    });

    test("deve retornar 400 ao criar usuário sem email", async () => {
        expect.assertions(1);
        try {
            await axios.post(`${api}/usuarios`, {
                nome: "João Silva",
                senha: "123456",
                tipo: "aluno",
            });
        } catch (err) {
            expect(err.response.status).toBe(400);
        }
    });

    test("deve retornar 400 ao criar usuário com email já cadastrado", async () => {
        expect.assertions(1);
        const email = `duplicado_${Date.now()}@email.com`;
        await axios.post(`${api}/usuarios`, { nome: "Maria Souza", email, senha: "123456", tipo: "aluno" });

        try {
            await axios.post(`${api}/usuarios`, { nome: "Carlos Lima", email, senha: "abcdef", tipo: "aluno" });
        } catch (err) {
            expect(err.response.status).toBe(400);
        }
    });

    test("deve atualizar os dados de um usuário", async () => {
        expect.assertions(2);
        const criado = await axios.post(`${api}/usuarios`, {
            nome: "Pedro Antigo",
            email: `pedro_${Date.now()}@email.com`,
            senha: "123456",
            tipo: "aluno",
        });

        const res = await axios.put(`${api}/usuarios/${criado.data.id}`, { nome: "Pedro Novo" });
        expect(res.status).toBe(200);
        expect(res.data.nome).toBe("Pedro Novo");
    });

    test("deve retornar 404 ao atualizar usuário inexistente", async () => {
        expect.assertions(1);
        try {
            await axios.put(`${api}/usuarios/99999`, { nome: "Ninguém" });
        } catch (err) {
            expect(err.response.status).toBe(404);
        }
    });

    test("deve remover um usuário", async () => {
        expect.assertions(1);
        const criado = await axios.post(`${api}/usuarios`, {
            nome: "Para Deletar",
            email: `deletar_${Date.now()}@email.com`,
            senha: "123456",
            tipo: "aluno",
        });

        const res = await axios.delete(`${api}/usuarios/${criado.data.id}`);
        expect(res.status).toBe(204);
    });

    test("deve retornar 404 ao deletar usuário inexistente", async () => {
        expect.assertions(1);
        await expect(
            axios.delete(`${api}/usuarios/8888`)
        ).rejects.toMatchObject({
            response: {
                status: 404
            }
        });
    });
});
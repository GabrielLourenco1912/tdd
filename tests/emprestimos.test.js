const axios = require('axios');
require('dotenv').config();
const api = `http://localhost:${process.env.PORT || 3000}`;

async function init (disponivel = true) {
    const livro = await axios.post(`${api}/livros`, {
        titulo: 'Clean Code',
        autor: 'Martin Code',
        disponivel: disponivel
    });

    const usuario = await axios.post(`${api}/usuarios`, {
        nome: "João Silva",
        email: `joao_${Date.now()}@email.com`,
        senha: "123456",
        tipo: "aluno",
    });

    return {
        LIVRO_ID: livro.data.id,
        USUARIO_ID: usuario.data.id
    };
}

describe("Empréstimos", () => {
    test("POST /emprestimos deve registrar um novo empréstimo", async () => {
        expect.assertions(2);
        const { LIVRO_ID, USUARIO_ID } = await init();
        const res = await axios.post(`${api}/emprestimos`, {
            livro_id: LIVRO_ID,
            usuario_id: USUARIO_ID,
            data_devolucao_prevista: "2025-05-01",
        });
        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty("id");

        await axios.delete(`${api}/emprestimos/${res.data.id}`);
    });

    test("GET /emprestimos deve retornar uma lista de empréstimos", async () => {
        expect.assertions(2);
        const res = await axios.get(`${api}/emprestimos`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.data)).toBe(true);
    });

    test("DELETE /emprestimos/:id deve deletar um empréstimo", async () => {
        expect.assertions(1);
        const { LIVRO_ID, USUARIO_ID } = await init();
        const emprestimo = await axios.post(`${api}/emprestimos`, {
            livro_id: LIVRO_ID,
            usuario_id: USUARIO_ID,
            data_devolucao_prevista: "2025-05-01",
        });
        const res = await axios.delete(`${api}/emprestimos/${emprestimo.data.id}`);
        expect(res.status).toBe(204);
    });

    test("deve retornar 404 ao deletar empréstimo inexistente", async () => {
        expect.assertions(1);
        await expect(
            axios.delete(`${api}/emprestimos/8888`)
        ).rejects.toMatchObject({
            response: {
                status: 404
            }
        });
    });

    test("deve retornar um empréstimo pelo id", async () => {
        expect.assertions(4);
        const { LIVRO_ID, USUARIO_ID } = await init();
        const emprestimo = await axios.post(`${api}/emprestimos`, {
            livro_id: LIVRO_ID,
            usuario_id: USUARIO_ID,
            data_devolucao_prevista: "2025-05-01",
        });
        const res = await axios.get(`${api}/emprestimos/${emprestimo.data.id}`);
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("id");
        expect(res.data).toHaveProperty("livro_id");
        expect(res.data).toHaveProperty("data_devolucao_prevista");

        await axios.delete(`${api}/emprestimos/${res.data.id}`);
    });

    test("deve retornar 400 ao registrar empréstimo sem livro_id", async () => {
        expect.assertions(1);
        try {
            const { USUARIO_ID } = await init();
            await axios.post(`${api}/emprestimos`, {
                usuario_id: USUARIO_ID,
                data_devolucao_prevista: "2025-05-01",
            });
        } catch (err) {
            expect(err.response.status).toBe(400);
        }
    });

    test("deve retornar 400 ao registrar empréstimo sem usuario_id", async () => {
        expect.assertions(1);
        try {
            const { LIVRO_ID } = await init();
            await axios.post(`${api}/emprestimos`, {
                livro_id: LIVRO_ID,
                data_devolucao_prevista: "2025-05-01",
            });
        } catch (err) {
            expect(err.response.status).toBe(400);
        }
    });

    test("deve retornar 400 ao registrar empréstimo sem data de devolução", async () => {
        expect.assertions(1);
        try {
            const { USUARIO_ID, LIVRO_ID } = await init();
            await axios.post(`${api}/emprestimos`, {
                livro_id: LIVRO_ID,
                usuario_id: USUARIO_ID
            });
        } catch (err) {
            expect(err.response.status).toBe(400);
        }
    });

    test("deve registrar a devolução de um empréstimo", async () => {
        expect.assertions(2);
        const { LIVRO_ID, USUARIO_ID } = await init();
        const emprestimo = await axios.post(`${api}/emprestimos`, {
            livro_id: LIVRO_ID,
            usuario_id: USUARIO_ID,
            data_devolucao_prevista: "2025-05-01",
        });
        const res = await axios.put(`${api}/emprestimos/${emprestimo.data.id}`, {devolucao: '2026-04-03'});
        expect(res.status).toBe(200);
        expect(res.data.devolucao).toBe("2026-04-03T00:00:00.000Z");
    });

    test("deve retornar 404 ao devolver empréstimo inexistente", async () => {
        expect.assertions(1);
        await expect(
            axios.put(`${api}/emprestimos/8888`, {devolucao: '2026-04-03'})
        ).rejects.toMatchObject({
            response: {
                status: 404
            }
        });
    });

    test("deve listar empréstimos de um usuário específico", async () => {
        expect.assertions(2);
        const { USUARIO_ID } = await init();
        const response = await axios.get(`${api}/emprestimos/usuarios/${USUARIO_ID}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
    });

    test("deve retornar 400 ao emprestar livro já emprestado", async () => {
        expect.assertions(1);

        const { LIVRO_ID, USUARIO_ID } = await init(false);

        try {
            await axios.post(`${api}/emprestimos`, {
                livro_id: LIVRO_ID,
                usuario_id: USUARIO_ID,
                data_devolucao_prevista: "2025-05-01",
            });
        } catch (err) {
            expect(err.response.status).toBe(400);
        }
    });
});
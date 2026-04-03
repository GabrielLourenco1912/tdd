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
        const res = await axios.get(`${api}/emprestimos`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.data)).toBe(true);
    });

    test("DELETE /emprestimos/:id deve deletar um empréstimo", async () => {
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
        await expect(
            axios.delete(`${api}/emprestimos/8888`)
        ).rejects.toMatchObject({
            response: {
                status: 404
            }
        });
    });

    test("deve retornar um empréstimo pelo id", async () => {
        // criar o teste
    });

    test("deve retornar 400 ao registrar empréstimo sem livro_id", async () => {
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
        // criar o teste
    });

    test("deve retornar 404 ao devolver empréstimo inexistente", async () => {
        // criar o teste
    });

    test("deve listar empréstimos de um usuário específico", async () => {
        // criar o teste
    });

    test("deve retornar 400 ao emprestar livro já emprestado", async () => {
        // criar o teste
    });
});
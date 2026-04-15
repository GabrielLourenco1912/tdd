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

    const emprestimo = await axios.post(`${api}/emprestimos`, {
        livro_id: livro.data.id,
        usuario_id: usuario.data.id,
        data_devolucao_prevista: "2025-05-01",
    });

    return {
        LIVRO_ID: livro.data.id,
        USUARIO_ID: usuario.data.id,
        EMPRESTIMO_ID: emprestimo.data.id,
    };
}

describe("Multas", () => {
    test("POST /multas deve registrar uma nova multa", async () => {
        expect.assertions(2);
        const { EMPRESTIMO_ID } = await init();
        const res = await axios.post(`${api}/multas`, {
            emprestimo_id: EMPRESTIMO_ID,
            valor: 100,
            status_pagamento: 'pendente',
            data_geracao: "2025-05-01",
        });
        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty("id");

        await axios.delete(`${api}/multas/${res.data.id}`);
    });

    test("GET /multas deve retornar uma lista de multas", async () => {
        expect.assertions(2);
        const res = await axios.get(`${api}/multas`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.data)).toBe(true);
    });

    test("DELETE /multas/:id deve deletar uma multa", async () => {
        expect.assertions(1);
        const { EMPRESTIMO_ID } = await init();
        const multa = await axios.post(`${api}/multas`, {
            emprestimo_id: EMPRESTIMO_ID,
            valor: 100,
            status_pagamento: 'pendente',
            data_geracao: "2025-05-01",
        });
        const res = await axios.delete(`${api}/multas/${multa.data.id}`);
        expect(res.status).toBe(204);
    });

    test("deve retornar 404 ao deletar multa inexistente", async () => {
        expect.assertions(1);
        await expect(
            axios.delete(`${api}/multas/8888`)
        ).rejects.toMatchObject({
            response: {
                status: 404
            }
        });
    });

    test("deve retornar uma multa pelo id", async () => {
        expect.assertions(4);
        const { EMPRESTIMO_ID } = await init();
        const multa = await axios.post(`${api}/multas`, {
            emprestimo_id: EMPRESTIMO_ID,
            valor: 100,
            status_pagamento: 'pendente',
            data_geracao: "2025-05-01",
        });
        const res = await axios.get(`${api}/multas/${multa.data.id}`);
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("id");
        expect(res.data).toHaveProperty("emprestimo_id");
        expect(res.data).toHaveProperty("valor");

        await axios.delete(`${api}/multas/${res.data.id}`);
    });

    test("deve retornar 400 ao registrar multa sem empréstimo", async () => {
        expect.assertions(2);
        try {
            await axios.post(`${api}/multas`, {
                valor: 100,
                data_geracao: "2025-05-01",
            });
        } catch (err) {
            expect(err.response.status).toBe(400);
            expect(err.response.data.erro).toBe('emprestimo, valor e data de geração são obrigatórios');
        }
    });

    test("deve retornar 400 ao registrar multa sem data de geração", async () => {
        expect.assertions(2);
        try {
            const { EMPRESTIMO_ID } = await init();
            await axios.post(`${api}/multas`, {
                emprestimo_id: EMPRESTIMO_ID,
                valor: 100
            });
        } catch (err) {
            expect(err.response.status).toBe(400);
            expect(err.response.data.erro).toBe('emprestimo, valor e data de geração são obrigatórios');
        }
    });

    test("deve registrar o pagamento de uma multa", async () => {
        expect.assertions(2);
        const { EMPRESTIMO_ID } = await init();
        const multa = await axios.post(`${api}/multas`, {
            emprestimo_id: EMPRESTIMO_ID,
            valor: 100,
            status_pagamento: 'pendente',
            data_geracao: "2025-05-01",
        });
        const res = await axios.put(`${api}/multas/${multa.data.id}`, {status_pagamento: 'pago'});
        expect(res.status).toBe(200);
        expect(res.data.status_pagamento).toBe("pago");
    });

    test("deve retornar 404 ao pagar multa inexistente", async () => {
        expect.assertions(1);
        await expect(
            axios.put(`${api}/multas/8888`, {status_pagamento: 'pago'})
        ).rejects.toMatchObject({
            response: {
                status: 404,
                data: {
                    error: "multa not found"
                }
            }
        });
    });

    test("deve listar multas de um usuário específico", async () => {
        expect.assertions(2);
        const { USUARIO_ID } = await init();
        const response = await axios.get(`${api}/multas/usuarios/${USUARIO_ID}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
    });

    test("deve retornar 400 ao pagar multa já quitada", async () => {
        expect.assertions(1);

        const { EMPRESTIMO_ID } = await init();

        const res = await axios.post(`${api}/multas`, {
            emprestimo_id: EMPRESTIMO_ID,
            valor: 100,
            status_pagamento: 'pago',
            data_geracao: "2025-05-01",
        });

        try {
            await axios.put(`${api}/multas/${res.data.id}`, {
                status_pagamento: 'pago',
            });
        } catch (err) {
            expect(err.response.status).toBe(400);
        }
    });
});
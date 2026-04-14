const axios = require('axios');
require('dotenv').config();
const api = `http://localhost:${process.env.PORT || 3000}`;



describe("Empréstimos", () => {
    test("POST /multas deve registrar uma novo multa", async () => {
        expect.assertions(1);

    });

    test("GET /multas deve retornar uma lista de multas", async () => {
        expect.assertions(1);

    });

    test("DELETE /multas/:id deve deletar uma multa", async () => {
        expect.assertions(1);

    });

    test("deve retornar 404 ao deletar multa inexistente", async () => {
        expect.assertions(1);

    });

    test("deve retornar uma multa pelo id", async () => {
        expect.assertions(1);
    });

    test("deve retornar 400 ao registrar multa sem empréstimo", async () => {
        expect.assertions(1);

    });

    test("deve retornar 400 ao registrar empréstimo sem data de geração", async () => {
        expect.assertions(1);

    });

    test("deve registrar o pagamento de uma multa", async () => {
        expect.assertions(1);

    });

    test("deve retornar 404 ao pagar multa inexistente", async () => {
        expect.assertions(1);

    });

    test("deve listar multas de um usuário específico", async () => {
        expect.assertions(2);

    });

    test("deve retornar 400 ao pagar multa já quitada", async () => {
        expect.assertions(1);


    });
});
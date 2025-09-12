app.post("/imprimir", async (req, res) => {
  try {
    const { carrinho, id_venda } = req.body;
    console.log("Body recebido:", req.body);

    let printer = new ThermalPrinter.printer({
      type: "epson",
      interface: "printer:EPSON_TM-T20", // exemplo Windows
      characterSet: "SLOVENIA"
    });

    // tenta só logar, não quebrar
    const isConnected = await printer.isPrinterConnected();
    console.log("Conectada?", isConnected);

    printer.alignCenter();
    printer.bold(true);
    printer.println("Obrigado por comprar pelo OSA!");
    printer.bold(false);

    const uniformes = carrinho?.detalhesUniformesFormatados || "";
    const armarios = carrinho?.detalhesArmarioFormatado || "";
    const extraUniformes = carrinho?.extraUniformes || "";

    if (uniformes && !armarios) {
      printer.println("\n--- UNIFORMES ---");
      printer.println(uniformes);
      printer.println("\n" + extraUniformes);
    } else if (armarios && !uniformes) {
      printer.println("\n--- ARMÁRIOS ---");
      printer.println(armarios);
    } else if (armarios && uniformes) {
      printer.println("\n--- UNIFORMES ---");
      printer.println(uniformes);
      printer.println("\n--- ARMÁRIOS ---");
      printer.println(armarios);
      printer.println("\n" + extraUniformes);
    }

    if (carrinho?.extra) {
      printer.println("\n" + carrinho.extra);
    }

    printer.println("\nNúmero da venda: " + id_venda);

    await printer.execute();

    res.send({ ok: true });
  } catch (err) {
    console.error("Erro ao imprimir:", err);
    res.status(500).send({ ok: false, error: err.message });
  }
})it 
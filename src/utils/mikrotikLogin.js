export function postToMikrotikLogin(actionUrl, fields) {
    if (!actionUrl) throw new Error("Mikrotik login URL is required");

    const form = document.createElement("form");
    form.method = "POST";
    form.action = actionUrl;

    const payload = {
        username: fields.username,
        password: fields.password,
        popup: fields.popup ? "true" : "false",
        dst: fields.dst || "",
    };

    for (const key in payload) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = payload[key];
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
}

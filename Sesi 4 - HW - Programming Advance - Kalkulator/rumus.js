export function kalkulator(angka1, angka2, operator) {
    // Cek apakah angka1 atau angka2 bukan angka
    if (isNaN(angka1) || isNaN(angka2)) {
        return "Error: Input harus berupa angka!";
    }
    switch (operator) {
        case "+":
            return angka1 + angka2;
        case "-":
            return angka1 - angka2;
        case "*":
            return angka1 * angka2;
        case "/":
            if (angka2 === 0) {
                return "Error: Pembagian dengan nol tidak diperbolehkan!";
            }
            return angka1 / angka2;
        default:
            return "Operator tidak valid!";
    }
}
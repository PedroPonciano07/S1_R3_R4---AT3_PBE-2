import createMulter from "../configs/upload.multer.js";

const uploadImage = createMulter({
    pasta: "imagens",
    tiposPermitidos: ["image/jpeg", "image/png", "image/jpg"],
    tamanhoArquivos: 5 * 1024 * 1024 // 5MB
});

export default uploadImage;
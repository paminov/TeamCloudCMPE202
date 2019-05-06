import { Storage } from "aws-amplify";

export async function uploadFileToS3(file) {
    const filename = `${Date.now()}-${file.name}`;
    const stored = await Storage.vault.put(filename, file, {
        contentType: file.type
    });
    return stored.key;
}

export async function deletFileFromS3(file) {
    const stored = await Storage.vault.remove(file.attachment);
    return stored.key;
}
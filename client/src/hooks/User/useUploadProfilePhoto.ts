import fetchWithToken from "@/utils/fetchWithToken"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useUploadProfilePhoto() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ file }: { file: File }) => {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetchWithToken("/users/perfil/photo", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || "Erro ao fazer upload da foto de perfil.")
            }

            return res.json()
        },
        onSuccess: () => {
            // Invalida as queries relacionadas ao usuário e perfil
            queryClient.invalidateQueries({ queryKey: ["user"] })
            queryClient.invalidateQueries({ queryKey: ["profile"] })
        },
        onError: (error: Error) => {
            console.error("Erro no upload da foto de perfil:", error.message)
        }
    })
}
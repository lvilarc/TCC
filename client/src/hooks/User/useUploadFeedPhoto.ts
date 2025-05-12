import fetchWithToken from "@/utils/fetchWithToken"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useUploadFeedPhoto() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ file }: { file: File }) => {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetchWithToken("/users/feed/photo", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.message || "Erro ao fazer upload da foto.")
            }

            return res.json()
        },
        onSuccess: () => {
            // Invalida todas as queries relacionadas a "user"
            queryClient.invalidateQueries({ queryKey: ["user"] })
        },
    })
}

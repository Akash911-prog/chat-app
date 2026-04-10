import toast from "react-hot-toast";

export const customToast = {
    success: (title: string, message: string) =>
        toast.success({ title, message } as any, { duration: 4000 }),

    error: (title: string, message: string) =>
        toast.error({ title, message } as any, { duration: 4000 }),

    info: (title: string, message: string) =>
        toast({ title, message } as any, { duration: 4000 }),

    warning: (title: string, message: string) =>
        toast({ title, message } as any, { duration: 4000 }),

    promise: <T>(
        promise: Promise<T>,
        messages: { loading: string; success: string; error: string },
    ) => {
        const id = toast.loading({
            title: "loading",
            message: messages.loading,
        } as any);
        promise
            .then(() => {
                toast.dismiss(id);
                customToast.success("Success", messages.success);
            })
            .catch(() => {
                toast.dismiss(id);
                customToast.error("failed", messages.error);
            });
        return promise;
    },
};

import {createMutation, createQuery} from "react-query-kit";
import {queryClient} from "./App";

export const hostUrl = process.env.REACT_APP_HOST

export const fetchUrl = method => {
    return `${hostUrl}/waInstance${localStorage.getItem('idInstance')}/${method}/${localStorage.getItem('apiTokenInstance')}`
}

export const useGetChat = createQuery({
    queryKey: ['getChatHistory'],
    fetcher: chatId => {
        return fetch(fetchUrl('getChatHistory'), {
            method: 'POST',
            body: JSON.stringify({chatId}),
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                throw new Error('Something went wrong')
            })
    },
    refetchInterval: 10000,
})

export const useGetContact = createMutation({
    mutationFn: chatId =>
        fetch(fetchUrl('getContactInfo'), {
            method: 'POST',
            body: JSON.stringify({chatId}),
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                throw new Error('Something went wrong')
            })

})

export const useSendMessage = createMutation({
    mutationFn: ({chatId, message}) =>
        fetch(fetchUrl('sendMessage'), {
            method: 'POST',
            body: JSON.stringify({chatId, message}),
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                throw new Error('Something went wrong')
            }),
    onSuccess(data, variables) {
        queryClient.setQueryData(['getChatHistory', variables.chatId], messages => {
            return [{...data, ...variables, textMessage: variables.message, type: 'outgoing'}, ...messages]
        })
        queryClient.fetchQuery(useGetNotifications.getFetchOptions())
        // queryClient.fetchQuery(useGetChat.getFetchOptions(variables.chatId))
    },
})

export const useGetNotifications = createQuery({
    queryKey: ['receiveNotification'],
    fetcher: () => fetch(fetchUrl('receiveNotification'))
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            throw new Error('Something went wrong')
        }),
    refetchInterval: 5000,
    onSuccess(data) {
        if (!data) return
        const {body, receiptId} = data

        queryClient.setQueryData(['getChatHistory', body.senderData.chatId], (messages = []) => {
            if (messages.some(message => message.idMessage === body.idMessage)) return
            return [{
                textMessage: body.messageData.textMessageData?.textMessage || body.messageData.extendedTextMessageData?.text,
                type: 'incoming',
                idMessage: body.idMessage,
                senderName: body.senderData.senderName
            }, ...messages]
        })

        fetch(fetchUrl('deleteNotification') + `/${receiptId}`, {method: 'DELETE'})
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                throw new Error('Something went wrong')
            })
            .then(() => queryClient.fetchQuery(useGetNotifications.getFetchOptions()))
    }
})
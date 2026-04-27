import { supabase } from './supabase'

export const newsletterService = {
  async subscribe(email: string, name?: string) {
    const { error } = await supabase.from('newsletter_subscribers').upsert(
      { email, name: name || null, is_active: true, subscribed_at: new Date().toISOString() },
      { onConflict: 'email', ignoreDuplicates: false },
    )
    if (error) throw error
  },

  async unsubscribe(email: string) {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
      .eq('email', email)
    if (error) throw error
  },

  async getAllSubscribers() {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false })
    if (error) throw error
    return data || []
  },
}

export const contactService = {
  async submitMessage(message: {
    name: string
    email: string
    subject: string
    message: string
  }) {
    const { error } = await supabase.from('contact_messages').insert(message)
    if (error) throw error
  },

  async getAllMessages() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async markAsRead(id: string) {
    const { error } = await supabase.from('contact_messages').update({ is_read: true }).eq('id', id)
    if (error) throw error
  },

  async markAsReplied(id: string) {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true, replied: true })
      .eq('id', id)
    if (error) throw error
  },

  async deleteMessage(id: string) {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    if (error) throw error
  },
}

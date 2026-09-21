/**
 * WhatsApp Template Message Helpers for MyDukazPOS
 */

export const sendMamaWelcomeWhatsApp = (mamaName: string, agentCode = 'AG-ELD-001') => {
  const message = `🌿 *Karibu MyDukazPOS!* 🌿\n\nMama ${mamaName}, umekaribishwa na *Agent Brian (${agentCode}) - Eldoret*.\n\n✨ *20 BOB per day tu* = Deni SMS + Faida Leo + Bila Bundles\n📲 *Free WhatsApp Receipts & Reminders*\n🛒 *Community Soko*: Best stock prices daily\n\nNeed Help? Contact: info@mydukazpos.com\nAgent Brian atakufungulia in 2 minutes!\n\nhttp://mydukazpos.com/join/${agentCode}`;
  return message;
};

export const sendAgentNotificationWhatsApp = (mamaName: string, agentPhone = '254712345678', agentCode = 'AG-ELD-001') => {
  const message = `🔥 *Poa Brian!* 🔥\nMama ${mamaName} ame-join via your link ${agentCode}.\n\n📊 *My Dukaz*: 13 (12 Active)\n💰 *Pending*: KES 100\n\nKeep sharing: http://mydukazpos.com/join/${agentCode}`;
  
  const cleanPhone = agentPhone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  return whatsappUrl;
};

import type { Address } from '../types/shared_interface';
import type { JobType } from '../types/client_interface';
import { emojiMap } from '../types/client_interface';

export const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatAddress = (address: Address) => {
    if (!address) return 'N/A';
    const parts = [
        address.street,
        address.city,
        address.region,
        address.postalCode,
        address.country
    ].filter(Boolean);
    return parts.join(', ') || 'No address provided';
};

export const formatTagText = (tagText: string) => {
    return tagText.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

export const formatIcon = (icon: string): string => {
  return emojiMap[icon as JobType] || '❓';
};
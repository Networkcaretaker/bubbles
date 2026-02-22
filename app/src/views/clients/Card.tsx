//import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, PhoneIcon, MapPin, Info } from 'lucide-react';
import { WhatsApp } from '../../components/ui/IconSets'; 
import type { Client } from '../../types/client_interface';
//import type { Contact } from '../../types/contact_interface';
import { ProfileInitial } from '../../functions/user_functions';
import { formatTagText, formatAddress, formatIcon } from '../../functions/shared_functions';
import { theme } from '../../components/styles/theme';

interface CardProps {
  client: Client;
  isViewing: boolean;
  onView: () => void;
  onCancelView: () => void;
}

export default function Card({
  client,
  isViewing,
  onView,
  onCancelView,
}: CardProps) {
  return (
    <div className={`${theme.card.layout}`}>
      <div className={`${theme.card.header}`}>
        <div className={`${theme.card.title_layout}`}>
          <div className={`${theme.card.profile_layout}`}>
            <div className={`${theme.card.profile_initial}`}>
              {ProfileInitial(client.name)}
            </div>
            <div>
              <p className={isViewing ? `${theme.card.title_text_xp}` : `${theme.card.title_text}` }>
                {client.name}
              </p>
              <p className={`${theme.card.profile_tag}`}>
                {formatTagText(client.clientType)}
              </p>
            </div>
          </div>
        </div>
        {isViewing 
          ? <div className={`${theme.card.selection_area}`} onClick={onCancelView} />
          : <div className={`${theme.card.selection_area}`} onClick={onView} />
        }
      </div>

      {isViewing &&
        <div className={`${theme.card.content}`}>
          {client.status && (
            <div className={`${theme.card.content_section}`}>
              <div className={`${theme.card.icon_list}`}>
                <p className={`${theme.card.section_title}`}>Status: </p>
                <p className={`${theme.card.tag}`}>{formatTagText(client.status)}</p>
              </div>
            </div>
          )}

          {/* Client Details */}
          <div className={`${theme.card.content_section}`}>
            <div className={`${theme.card.icon_list}`}>
              <PhoneIcon className={`${theme.icon.xs}`} />
              {client.phone ? <p>{client.phone}</p> : <p>No phone number provided</p>}
            </div>
            <div className={`${theme.card.icon_list}`}>
              <Mail className={`${theme.icon.xs}`} />
              {client.email ? <p>{client.email}</p> : <p>No email provided</p>}
            </div>
            <div className={`${theme.card.icon_list}`}>
              <MapPin className={`${theme.icon.xs}`} />
              <p>{formatAddress(client.address)}</p>
            </div>
          </div>

          {/* Client Jobs */}
          {client.clientJobs && client.clientJobs.length > 0 && (
            <div className={`${theme.card.content_section}`}>
              <p className={`${theme.card.section_title}`}>Client Jobs</p>
              <div className={`${theme.card.item_list}`}> 
                {client.clientJobs.map((job, index) => (
                  <div key={index} className={`${theme.card.item_index}`}>
                    <div className={`${theme.card.items}`}>
                      <p className={`${theme.card.item_text}`}>
                        {formatIcon(job.jobType)} {job.jobName}
                      </p>
                      <p className={`${theme.card.tags}`}>
                        {formatTagText(job.jobType)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={`${theme.card.action_grid}`}>
            {client.phone &&
            <a className={`${theme.button.outline}`} 
                href={`tel:${client.phone}`}>
                <PhoneIcon className={`${theme.icon.lg}`} />
            </a>
            }
            {client.email &&
            <a className={`${theme.button.outline}`}
              href={`mailto:${client.email}`}>
                <Mail className={`${theme.icon.lg}`} />
            </a>
            }
            {client.phone &&
            <a className={`${theme.button.outline}`} 
              href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer">
                <WhatsApp className={`${theme.icon.lg}`} />
            </a>
            }
            <Link to={`/clients/${client.id}`} className={`${theme.button.outline}`}>
              <Info className={`${theme.icon.lg}`} />
            </Link>
          </div>
        </div>
      }
    </div>
  );
}
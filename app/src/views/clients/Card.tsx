//import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, PhoneIcon, MapPin, Info } from 'lucide-react';
import { WhatsApp } from '../../components/ui/IconSets'; 
import type { Client } from '../../types/client_interface';
//import type { Contact } from '../../types/contact_interface';
import { Theme } from '../../components/ui/Theme';
import { ProfileInitial } from '../../functions/user_functions';
import { formatTagText, formatAddress, formatIcon } from '../../functions/shared_functions';

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
    <div className={`${Theme.card.layout}`}>
      <div className={`${Theme.card.header}`}>
        <div className={`${Theme.card.title_layout}`}>
          <div className={`${Theme.card.profile_layout}`}>
            <div className={`${Theme.card.profile_initial}`}>
              {ProfileInitial(client.name)}
            </div>
            <div>
              <p className={isViewing ? `${Theme.card.title_text_xp}` : `${Theme.card.title_text}` }>
                {client.name}
              </p>
              <p className={`${Theme.card.profile_tag}`}>
                {formatTagText(client.clientType)}
              </p>
            </div>
          </div>
        </div>
        {isViewing 
          ? <div className={`${Theme.card.selection_area}`} onClick={onCancelView} />
          : <div className={`${Theme.card.selection_area}`} onClick={onView} />
        }
      </div>

      {isViewing &&
        <div className={`${Theme.card.content}`}>
          {client.status && (
            <div className={`${Theme.card.content_section}`}>
              <div className={`${Theme.card.icon_list}`}>
                <p className={`${Theme.card.section_title}`}>Status: </p>
                <p className={`${Theme.card.tag}`}>{formatTagText(client.status)}</p>
              </div>
            </div>
          )}

          {/* Client Details */}
          <div className={`${Theme.card.content_section}`}>
            <div className={`${Theme.card.icon_list}`}>
              <PhoneIcon className={`${Theme.icon.xs}`} />
              {client.phone ? <p>{client.phone}</p> : <p>No phone number provided</p>}
            </div>
            <div className={`${Theme.card.icon_list}`}>
              <Mail className={`${Theme.icon.xs}`} />
              {client.email ? <p>{client.email}</p> : <p>No email provided</p>}
            </div>
            <div className={`${Theme.card.icon_list}`}>
              <MapPin className={`${Theme.icon.xs}`} />
              <p>{formatAddress(client.address)}</p>
            </div>
          </div>

          {/* Client Jobs */}
          {client.clientJobs && client.clientJobs.length > 0 && (
            <div className={`${Theme.card.content_section}`}>
              <p className={`${Theme.card.section_title}`}>Client Jobs</p>
              <div className={`${Theme.card.item_list}`}> 
                {client.clientJobs.map((job, index) => (
                  <div key={index} className={`${Theme.card.item_index}`}>
                    <div className={`${Theme.card.items}`}>
                      <p className={`${Theme.card.item_text}`}>
                        {formatIcon(job.jobType)} {job.jobName}
                      </p>
                      <p className={`${Theme.card.tags}`}>
                        {formatTagText(job.jobType)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={`${Theme.card.action_grid}`}>
            {client.phone &&
            <a className={`${Theme.button.outline}`} 
                href={`tel:${client.phone}`}>
                <PhoneIcon className={`${Theme.icon.lg}`} />
            </a>
            }
            {client.email &&
            <a className={`${Theme.button.outline}`}
              href={`mailto:${client.email}`}>
                <Mail className={`${Theme.icon.lg}`} />
            </a>
            }
            {client.phone &&
            <a className={`${Theme.button.outline}`} 
              href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer">
                <WhatsApp className={`${Theme.icon.lg}`} />
            </a>
            }
            <Link to={`/clients/${client.id}`} className={`${Theme.button.outline}`}>
              <Info className={`${Theme.icon.lg}`} />
            </Link>
          </div>
        </div>
      }
    </div>
  );
}
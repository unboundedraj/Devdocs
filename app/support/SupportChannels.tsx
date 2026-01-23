import { SupportChannel } from '@/types/supportpage';
import SupportChannelCard from './SupportChannelCard';

interface SupportChannelsProps {
  channels: SupportChannel[];
}

export default function SupportChannels({ channels }: SupportChannelsProps) {
  if (!channels || channels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No support channels available at this time.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {channels.map((channel, index) => (
        <SupportChannelCard key={index} channel={channel} />
      ))}
    </div>
  );
}
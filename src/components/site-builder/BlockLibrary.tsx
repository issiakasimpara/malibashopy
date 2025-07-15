
import { blockTemplates } from '@/data/blockTemplates';
import BlockLibraryItem from './BlockLibraryItem';
import { TemplateBlock } from '@/types/template';

interface BlockLibraryProps {
  onBlockAdd: (block: TemplateBlock) => void;
}

const BlockLibrary = ({ onBlockAdd }: BlockLibraryProps) => {
  const handleAddBlock = (blockTemplate: any) => {
    const newBlock: TemplateBlock = {
      id: `${blockTemplate.type}-${Date.now()}`,
      type: blockTemplate.type,
      content: blockTemplate.content,
      styles: blockTemplate.styles,
      order: 0
    };
    onBlockAdd(newBlock);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Bibliothèque de blocs</h3>
      <div className="grid gap-2">
        {blockTemplates.map((blockTemplate) => (
          <BlockLibraryItem
            key={blockTemplate.type}
            blockType={blockTemplate}
            onAddBlock={handleAddBlock}
          />
        ))}
      </div>
    </div>
  );
};

export default BlockLibrary;

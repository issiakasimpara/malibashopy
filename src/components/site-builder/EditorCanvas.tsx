
import { useState } from 'react';
import { TemplateBlock } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';
import BlockRenderer from './BlockRenderer';
import type { Tables } from '@/integrations/supabase/types';

type Store = Tables<'stores'>;

interface EditorCanvasProps {
  blocks: TemplateBlock[];
  selectedBlock: TemplateBlock | null;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  selectedStore?: Store | null;
  onBlockSelect: (block: TemplateBlock) => void;
  onBlockUpdate: (block: TemplateBlock) => void;
  onBlockDelete: (blockId: string) => void;
  onBlockReorder: (draggedBlockId: string, targetBlockId: string) => void;
}

const EditorCanvas = ({
  blocks,
  selectedBlock,
  viewMode,
  selectedStore,
  onBlockSelect,
  onBlockUpdate,
  onBlockDelete,
  onBlockReorder
}: EditorCanvasProps) => {
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);

  const getCanvasWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'w-full';
    }
  };

  const handleDragStart = (blockId: string) => {
    setDraggedBlock(blockId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    if (draggedBlock && draggedBlock !== targetBlockId) {
      onBlockReorder(draggedBlock, targetBlockId);
    }
    setDraggedBlock(null);
  };

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="flex-1 bg-gray-100 overflow-y-auto mt-20">
      <div className={`bg-white min-h-full ${getCanvasWidth()}`}>
        {sortedBlocks.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">📄</div>
              <p>Ajoutez des blocs pour commencer à construire votre page</p>
            </div>
          </div>
        ) : (
          sortedBlocks.map((block) => (
            <div
              key={block.id}
              className={`relative group ${
                selectedBlock?.id === block.id ? 'ring-2 ring-blue-500' : ''
              }`}
              draggable
              onDragStart={() => handleDragStart(block.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, block.id)}
              onClick={() => onBlockSelect(block)}
            >
              {/* Overlay d'édition */}
              <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500/10 cursor-pointer">
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                  >
                    <GripVertical className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBlockDelete(block.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {block.type}
                  </span>
                </div>
              </div>

              {/* Rendu du bloc */}
              <BlockRenderer
                block={block}
                isEditing={true}
                viewMode={viewMode}
                onUpdate={onBlockUpdate}
                selectedStore={selectedStore}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;

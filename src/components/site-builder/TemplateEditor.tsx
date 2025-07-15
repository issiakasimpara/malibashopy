
import { Template } from '@/types/template';
import { useStores } from '@/hooks/useStores';
import { useTemplateState } from '@/hooks/useTemplateState';
import { useTemplateOperations } from '@/hooks/useTemplateOperations';
import { useSiteTemplates } from '@/hooks/useSiteTemplates';
import TemplateEditorLayout from './TemplateEditorLayout';

interface TemplateEditorProps {
  template: Template;
  onBack: () => void;
}

const TemplateEditor = ({ template, onBack }: TemplateEditorProps) => {
  const { stores } = useStores();
  const selectedStore = stores.length > 0 ? stores[0] : null;
  const { isSaving } = useSiteTemplates(selectedStore?.id);

  const {
    currentPage,
    selectedBlock,
    viewMode,
    showStylePanel,
    showPreview,
    showSettings,
    templateData,
    hasUnsavedChanges,
    setCurrentPage,
    setSelectedBlock,
    setViewMode,
    setShowStylePanel,
    setShowPreview,
    setShowSettings,
    handleSave,
    handlePreview,
    handlePublish,
    handleTemplateUpdate,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useTemplateState({ initialTemplate: template });

  const {
    pageBlocks,
    handlePageChange,
    handleBlockSelect,
    handleBlockUpdate,
    handleBlockAdd,
    handleBlockDelete,
    handleBlockReorder,
  } = useTemplateOperations({
    templateData,
    currentPage,
    selectedBlock,
    onTemplateUpdate: handleTemplateUpdate,
    setSelectedBlock,
  });

  const wrappedPageChange = (page: string) => {
    setCurrentPage(page);
    handlePageChange(page);
  };

  const handleClosePropertiesPanel = () => {
    setSelectedBlock(null);
  };

  return (
    <TemplateEditorLayout
      templateData={templateData}
      currentPage={currentPage}
      selectedBlock={selectedBlock}
      pageBlocks={pageBlocks}
      viewMode={viewMode}
      showStylePanel={showStylePanel}
      showPreview={showPreview}
      showSettings={showSettings}
      hasUnsavedChanges={hasUnsavedChanges}
      isSaving={isSaving}
      selectedStore={selectedStore}
      onBack={onBack}
      onViewModeChange={setViewMode}
      onSave={() => handleSave()}
      onPreview={handlePreview}
      onPublish={handlePublish}
      onPageChange={wrappedPageChange}
      onBlockAdd={handleBlockAdd}
      onBlockSelect={handleBlockSelect}
      onBlockUpdate={handleBlockUpdate}
      onBlockDelete={handleBlockDelete}
      onBlockReorder={handleBlockReorder}
      onTemplateUpdate={handleTemplateUpdate}
      onToggleSettings={() => setShowSettings(!showSettings)}
      onToggleStylePanel={() => setShowStylePanel(!showStylePanel)}
      onClosePreview={() => setShowPreview(false)}
      onClosePropertiesPanel={handleClosePropertiesPanel}
      // Nouvelles props pour l'historique
      onUndo={undo}
      onRedo={redo}
      canUndo={canUndo}
      canRedo={canRedo}
    />
  );
};

export default TemplateEditor;

import { useCallback } from 'react';
import { Template } from '@/types/template';
import { useToast } from '@/hooks/use-toast';

interface UseTemplateActionsProps {
  selectedStore: any;
  templateData: Template;
  setHasUnsavedChanges: (value: boolean) => void;
  saveTemplate: (store_id: string, template_id: string, template_data: any, is_published?: boolean) => Promise<string>;
}

export const useTemplateActions = ({
  selectedStore,
  templateData,
  setHasUnsavedChanges,
  saveTemplate
}: UseTemplateActionsProps) => {
  const { toast } = useToast();

  const handleSave = useCallback(async (silent = false) => {
    if (!selectedStore?.id) {
      toast({
        title: "Erreur",
        description: "Aucun magasin sélectionné pour la sauvegarde.",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveTemplate(selectedStore.id, templateData.id, templateData, false);
      setHasUnsavedChanges(false);
      
      if (!silent) {
        toast({
          title: "Template sauvegardé",
          description: "Vos personnalisations ont été enregistrées avec succès.",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder vos modifications.",
        variant: "destructive"
      });
    }
  }, [selectedStore?.id, templateData, saveTemplate, setHasUnsavedChanges, toast]);

  const handlePreview = useCallback(() => {
    toast({
      title: "Aperçu ouvert",
      description: "L'aperçu reflète vos modifications en temps réel.",
    });
  }, [toast]);

  const handlePublish = useCallback(async () => {
    if (!selectedStore?.id) {
      toast({
        title: "Erreur",
        description: "Aucun magasin sélectionné pour la publication.",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveTemplate(selectedStore.id, templateData.id, templateData, true);
      setHasUnsavedChanges(false);
      
      toast({
        title: "Site publié",
        description: "Votre site est maintenant en ligne avec toutes vos modifications !",
      });
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast({
        title: "Erreur de publication",
        description: "Impossible de publier votre site.",
        variant: "destructive"
      });
    }
  }, [selectedStore?.id, templateData, saveTemplate, setHasUnsavedChanges, toast]);

  return {
    handleSave,
    handlePreview,
    handlePublish,
  };
};
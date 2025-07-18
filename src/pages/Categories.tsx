
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/useCategories";
import { useStores } from "@/hooks/useStores";
import CategoryDialog from "@/components/categories/CategoryDialog";
import CategoriesHeader from "@/components/categories/CategoriesHeader";
import CategoriesSearch from "@/components/categories/CategoriesSearch";
import CategoriesGrid from "@/components/categories/CategoriesGrid";
import NoStoreSelectedState from "@/components/categories/NoStoreSelectedState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const { toast } = useToast();
  const { stores } = useStores();
  
  // Pour l'instant, on utilise la première boutique disponible
  const selectedStore = stores.length > 0 ? stores[0] : null;
  
  const {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting
  } = useCategories(selectedStore?.id);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowDialog(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowDialog(true);
  };

  const handleDeleteCategory = (category) => {
    setDeletingCategory(category);
  };

  const confirmDelete = () => {
    if (deletingCategory) {
      deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
    }
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      updateCategory({ ...categoryData, id: editingCategory.id });
    } else {
      createCategory(categoryData);
    }
    setShowDialog(false);
  };

  if (!selectedStore) {
    return (
      <DashboardLayout>
        <NoStoreSelectedState />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <CategoriesHeader 
          categoriesCount={categories.length}
          onAddCategory={handleAddCategory}
        />

        <CategoriesSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <CategoriesGrid
          categories={filteredCategories}
          searchTerm={searchTerm}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddCategory={handleAddCategory}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          isLoading={isLoading}
        />

        {/* Category Dialog */}
        <CategoryDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onSave={handleSaveCategory}
          category={editingCategory}
          storeId={selectedStore.id}
          isLoading={isCreating || isUpdating}
          categories={categories}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
          <AlertDialogContent className="bg-gradient-to-br from-background via-background to-muted/10 border-border/50">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">Supprimer la catégorie</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Êtes-vous sûr de vouloir supprimer la catégorie "{deletingCategory?.name}" ? 
                Cette action est irréversible et supprimera également toutes les sous-catégories associées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-muted transition-colors">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300"
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default Categories;

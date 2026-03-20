import { useState, useCallback } from "react";
import type { Kullanici } from '../services/types/kullanici.types';

export function useUserActions(
    fetchData: () => Promise<void>,
    deleteAction: (id: string | number) => Promise<void>,
    updateAction: (id: string | number, data: Partial<Kullanici>) => Promise<void>,
    createAction: (data: any) => Promise<void>
) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'view' | 'edit' | 'create'>('view');
    const [selectedUser, setSelectedUser] = useState<Kullanici | null>(null);

    const handleView = useCallback((user: Kullanici) => {
        setSelectedUser(user);
        setDrawerMode('view');
        setDrawerOpen(true);
    }, []);

    const handleEdit = useCallback((user: Kullanici) => {
        setSelectedUser(user);
        setDrawerMode('edit');
        setDrawerOpen(true);
    }, []);

    const handleDelete = useCallback(async (user: Kullanici) => {
        const identifier = user.ogrenciNo || user.personelNo || user.id;
        if (window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
            try {
                await deleteAction(identifier);
                await fetchData();
            } catch (error) {
                console.error("Silme hatası:", error);
            }
        }
    }, [deleteAction, fetchData]);

    const handleAdd = useCallback((defaultRole: Kullanici['rol']) => {
        setSelectedUser({ rol: defaultRole } as Kullanici);
        setDrawerMode('create');
        setDrawerOpen(true);
    }, []);

    const handleSave = async (updatedData: Partial<Kullanici>) => {
        try {
            if (drawerMode === 'create') {
                await createAction({ ...updatedData, rol: selectedUser?.rol || 'OGRENCI' });
            } else if (selectedUser) {
                const identifier = selectedUser.ogrenciNo || selectedUser.personelNo || selectedUser.id;
                await updateAction(identifier, updatedData);
            }
            setDrawerOpen(false);
            await fetchData();
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "İşlem sırasında bir hata oluştu.";
            console.error("İşlem başarısız:", errorMsg);
            alert(`Hata: ${errorMsg}`);
            throw error;
        }
    };

    return {
        drawerOpen,
        setDrawerOpen,
        drawerMode,
        selectedUser,
        handleView,
        handleEdit,
        handleDelete,
        handleSave,
        handleAdd
    };
}

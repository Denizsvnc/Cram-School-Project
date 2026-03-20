import { useEffect, useState, useCallback } from "react";
import { KullaniciService } from "../services/kullaniciApi";
import type { Kullanici } from "../services/types/kullanici.types";
import KullaniciTablosu, { KullaniciAvatar } from "./KullaniciTablosu";
import type { KolonTanimi } from "./KullaniciTablosu";
import { Typography } from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import { useUserActions } from "../hooks/useUserActions";
import { KullaniciDrawer } from "./KullaniciDrawer";

const kolonlar: KolonTanimi[] = [
    { baslik: "Personel", render: (k) => <KullaniciAvatar kullanici={k} /> },
    { baslik: "Email", render: (k) => <Typography variant="body2" color="text.secondary">{k.mail}</Typography> },
    { baslik: "Telefon", render: (k) => <Typography variant="body2" color="text.secondary">{k.tel_no || "—"}</Typography> },
    { baslik: "Eğitim", render: (k) => <Typography variant="body2" color="text.secondary">{k.egitim_durumu || "—"}</Typography> },
];

export default function Personeller() {
    const [personeller, setPersoneller] = useState<Kullanici[]>([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [hata, setHata] = useState<string | null>(null);

    const getir = useCallback(async () => {
        try {
            const data = await KullaniciService.getPersonelListesi();
            setPersoneller(data.personeller ?? []);
        } catch { setHata("Personeller yüklenirken bir hata oluştu."); }
        finally { setYukleniyor(false); }
    }, []);

    useEffect(() => {
        getir();
    }, [getir]);

    const {
        drawerOpen, setDrawerOpen, drawerMode, selectedUser,
        handleView, handleEdit, handleDelete, handleSave, handleAdd
    } = useUserActions(
        getir, 
        KullaniciService.personelSil as (id: string | number) => Promise<void>, 
        KullaniciService.personelGuncelle as (id: string | number, data: any) => Promise<void>,
        KullaniciService.kullaniciOlustur
    );

    return (
        <>
            <KullaniciTablosu
                baslik="Personel Listesi"
                ikon={<BadgeIcon sx={{ fontSize: 28, color: "#e65100" }} />}
                kullanicilar={personeller}
                yukleniyor={yukleniyor}
                hata={hata}
                kolonlar={kolonlar}
                bosMetin="Henüz kayıtlı personel yok."
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => handleAdd('PERSONEL')}
            />
            <KullaniciDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                user={selectedUser}
                mode={drawerMode}
                onSave={handleSave}
                roleTitle="Personel"
            />
        </>
    );
}

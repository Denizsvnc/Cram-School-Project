import { useEffect, useState, useCallback } from "react";
import { KullaniciService } from "../services/kullaniciApi";
import type { Kullanici } from "../services/types/kullanici.types";
import KullaniciTablosu, { KullaniciAvatar } from "./KullaniciTablosu";
import type { KolonTanimi } from "./KullaniciTablosu";
import { Chip, Typography } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useUserActions } from "../hooks/useUserActions";
import { KullaniciDrawer } from "./KullaniciDrawer";

const kolonlar: KolonTanimi[] = [
    { baslik: "Öğretmen", render: (k) => <KullaniciAvatar kullanici={k} /> },
    { baslik: "No", render: (k) => <Chip label={k.personelNo ? `#${k.personelNo}` : "—"} size="small" variant="outlined" sx={{ fontWeight: 600, fontFamily: "monospace" }} /> },
    { baslik: "Email", render: (k) => <Typography variant="body2" color="text.secondary">{k.mail}</Typography> },
    { baslik: "Maaş", render: (k) => <Chip label={k.maas_odendi_mi ? "Ödendi" : "Ödenmedi"} size="small" color={k.maas_odendi_mi ? "success" : "warning"} sx={{ fontWeight: 600, fontSize: "0.75rem" }} /> },
    { baslik: "İzin", render: (k) => <Typography variant="body2" color="text.secondary">{k.kullanilan_izin ?? 0}/{k.izin_hakki ?? 0} gün</Typography> },
];

export default function Ogretmenler() {
    const [ogretmenler, setOgretmenler] = useState<Kullanici[]>([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [hata, setHata] = useState<string | null>(null);

    const getir = useCallback(async () => {
        try {
            const data = await KullaniciService.getOgretmenler();
            setOgretmenler(data.personeller ?? []);
        } catch { setHata("Öğretmenler yüklenirken bir hata oluştu."); }
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
                baslik="Öğretmen Listesi"
                ikon={<MenuBookIcon sx={{ fontSize: 28, color: "#1565c0" }} />}
                kullanicilar={ogretmenler}
                yukleniyor={yukleniyor}
                hata={hata}
                kolonlar={kolonlar}
                bosMetin="Henüz kayıtlı öğretmen yok."
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => handleAdd('OGRETMEN')}
            />
            <KullaniciDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                user={selectedUser}
                mode={drawerMode}
                onSave={handleSave}
                roleTitle="Öğretmen"
            />
        </>
    );
}

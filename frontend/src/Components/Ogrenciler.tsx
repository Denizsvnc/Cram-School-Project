import { useEffect, useState, useCallback } from "react";
import { KullaniciService } from "../services/kullaniciApi";
import type { Kullanici } from "../services/types/kullanici.types";
import KullaniciTablosu, { KullaniciAvatar } from "./KullaniciTablosu";
import type { KolonTanimi } from "./KullaniciTablosu";
import { Chip, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useUserActions } from "../hooks/useUserActions";
import { KullaniciDrawer } from "./KullaniciDrawer";

const kolonlar: KolonTanimi[] = [
    { baslik: "Öğrenci", render: (k) => <KullaniciAvatar kullanici={k} /> },
    { baslik: "No", render: (k) => <Chip label={k.ogrenciNo ? `#${k.ogrenciNo}` : "—"} size="small" variant="outlined" sx={{ fontWeight: 600, fontFamily: "monospace" }} /> },
    { baslik: "Email", render: (k) => <Typography variant="body2" color="text.secondary">{k.mail}</Typography> },
    { baslik: "Telefon", render: (k) => <Typography variant="body2" color="text.secondary">{k.tel_no || "—"}</Typography> },
    { baslik: "Ödeme", render: (k) => <Chip label={k.odeme_durumu ? "Ödendi" : "Ödenmedi"} size="small" color={k.odeme_durumu ? "success" : "warning"} sx={{ fontWeight: 600, fontSize: "0.75rem" }} /> },
    { baslik: "Tutar", render: (k) => <Typography variant="body2" color="text.secondary">{k.odeme_tutari ? `${k.odeme_tutari.toLocaleString('tr-TR')} ₺` : "—"}{k.taksit_sayisi ? ` (${k.taksit_sayisi} ay)` : ""}</Typography> },
];

export default function Ogrenciler() {
    const [ogrenciler, setOgrenciler] = useState<Kullanici[]>([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [hata, setHata] = useState<string | null>(null);

    const getir = useCallback(async () => {
        try {
            const data = await KullaniciService.getOgrenciler();
            setOgrenciler(data.ogrenciler ?? []);
        } catch { setHata("Öğrenciler yüklenirken bir hata oluştu."); }
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
        KullaniciService.ogrenciSil as (id: string | number) => Promise<void>, 
        KullaniciService.ogrenciGuncelle as (id: string | number, data: any) => Promise<void>,
        KullaniciService.kullaniciOlustur
    );

    return (
        <>
            <KullaniciTablosu
                baslik="Öğrenci Listesi"
                ikon={<SchoolIcon sx={{ fontSize: 28, color: "primary.main" }} />}
                kullanicilar={ogrenciler}
                yukleniyor={yukleniyor}
                hata={hata}
                kolonlar={kolonlar}
                bosMetin="Henüz kayıtlı öğrenci yok."
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => handleAdd('OGRENCI')}
            />
            <KullaniciDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                user={selectedUser}
                mode={drawerMode}
                onSave={handleSave}
                roleTitle="Öğrenci"
            />
        </>
    );
}
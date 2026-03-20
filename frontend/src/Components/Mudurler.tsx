import { useEffect, useState, useCallback } from "react";
import { KullaniciService } from "../services/kullaniciApi";
import type { Kullanici } from "../services/types/kullanici.types";
import KullaniciTablosu, { KullaniciAvatar } from "./KullaniciTablosu";
import type { KolonTanimi } from "./KullaniciTablosu";
import { Chip, Typography } from "@mui/material";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useUserActions } from "../hooks/useUserActions";
import { KullaniciDrawer } from "./KullaniciDrawer";

const kolonlar: KolonTanimi[] = [
    { baslik: "Müdür", render: (k) => <KullaniciAvatar kullanici={k} /> },
    { baslik: "No", render: (k) => <Chip label={k.personelNo ? `#${k.personelNo}` : "—"} size="small" variant="outlined" sx={{ fontWeight: 600, fontFamily: "monospace" }} /> },
    { baslik: "Email", render: (k) => <Typography variant="body2" color="text.secondary">{k.mail}</Typography> },
    { baslik: "Telefon", render: (k) => <Typography variant="body2" color="text.secondary">{k.tel_no || "—"}</Typography> },
    { baslik: "Eğitim", render: (k) => <Typography variant="body2" color="text.secondary">{k.egitim_durumu || "—"}</Typography> },
];

export default function Mudurler() {
    const [mudurler, setMudurler] = useState<Kullanici[]>([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [hata, setHata] = useState<string | null>(null);

    const getir = useCallback(async () => {
        try {
            const data = await KullaniciService.getMudurler();
            setMudurler(data.personeller ?? []);
        } catch { setHata("Müdürler yüklenirken bir hata oluştu."); }
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
                baslik="Müdür Listesi"
                ikon={<SupervisorAccountIcon sx={{ fontSize: 28, color: "#7b1fa2" }} />}
                kullanicilar={mudurler}
                yukleniyor={yukleniyor}
                hata={hata}
                kolonlar={kolonlar}
                bosMetin="Henüz kayıtlı müdür yok."
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={() => handleAdd('MUDUR')}
            />
            <KullaniciDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                user={selectedUser}
                mode={drawerMode}
                onSave={handleSave}
                roleTitle="Müdür"
            />
        </>
    );
}

import React, { useState } from "react";
import type { Kullanici } from "../services/types/kullanici.types";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Chip, Avatar, Typography, TextField, InputAdornment, Box, Skeleton,
    IconButton, Tooltip, TablePagination, Button, useTheme
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AddIcon from "@mui/icons-material/Add";

export interface KolonTanimi {
    baslik: string;
    render: (kullanici: Kullanici) => React.ReactNode;
    align?: "left" | "center" | "right";
}

interface KullaniciTablosuProps {
    baslik: string;
    ikon: React.ReactNode;
    kullanicilar: Kullanici[];
    yukleniyor: boolean;
    hata: string | null;
    kolonlar: KolonTanimi[];
    aramaAlanlari?: (k: Kullanici) => string[];
    bosMetin?: string;
    onView?: (k: Kullanici) => void;
    onEdit?: (k: Kullanici) => void;
    onDelete?: (k: Kullanici) => void;
    onAdd?: () => void;
}

const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 55%, 50%)`;
};

export const KullaniciAvatar = ({ kullanici }: { kullanici: Kullanici }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
            sx={{
                width: 36, height: 36, fontSize: "0.85rem", fontWeight: 700,
                bgcolor: stringToColor(kullanici.isim + (kullanici.soy_isim || "")),
            }}
        >
            {kullanici.isim?.[0]}{kullanici.soy_isim?.[0]}
        </Avatar>
        <Typography variant="body2" fontWeight={600}>
            {kullanici.isim} {kullanici.soy_isim}
        </Typography>
    </Box>
);

const headerCellSx = {
    fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase",
    letterSpacing: 0.5, color: "text.secondary",
};

export default function KullaniciTablosu({
    baslik, ikon, kullanicilar, yukleniyor, hata, kolonlar,
    aramaAlanlari, bosMetin,
    onView, onEdit, onDelete, onAdd
}: KullaniciTablosuProps) {
    const theme = useTheme();
    const [arama, setArama] = useState("");
    const [sayfa, setSayfa] = useState(0);
    const [sayfaBoyutu, setSayfaBoyutu] = useState(10);

    const filtrelenmis = kullanicilar.filter((k) => {
        if (!arama) return true;
        const aranan = arama.toLowerCase();
        const alanlar = aramaAlanlari
            ? aramaAlanlari(k)
            : [k.isim, k.soy_isim || "", k.mail, String(k.ogrenciNo ?? k.personelNo ?? "")];
        return alanlar.some((a) => a.toLowerCase().includes(aranan));
    });

    const sayfadakiler = filtrelenmis.slice(sayfa * sayfaBoyutu, sayfa * sayfaBoyutu + sayfaBoyutu);

    if (yukleniyor) {
        return (
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {kolonlar.map((_, i) => (<TableCell key={i}><Skeleton width={80} /></TableCell>))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <TableRow key={i}>
                                {kolonlar.map((_, j) => (<TableCell key={j}><Skeleton /></TableCell>))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    if (hata) {
        return (
            <Box sx={{ textAlign: "center", py: 8, color: "error.main" }}>
                <ErrorOutlineIcon sx={{ fontSize: 64, mb: 2, opacity: 0.7 }} />
                <Typography variant="h6">{hata}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {ikon}
                    <Typography variant="h5" fontWeight={700}>{baslik}</Typography>
                    <Chip label={`${kullanicilar.length} kişi`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <TextField
                        size="small"
                        placeholder="Ara..."
                        value={arama}
                        onChange={(e) => { setArama(e.target.value); setSayfa(0); }}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>),
                        }}
                        sx={{ minWidth: 260 }}
                    />
                    {onAdd && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={onAdd}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: theme.shadows[2],
                                '&:hover': {
                                    boxShadow: theme.shadows[4],
                                }
                            }}
                        >
                            Yeni Ekle
                        </Button>
                    )}
                </Box>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "action.hover" }}>
                            {kolonlar.map((kolon, i) => (
                                <TableCell key={i} align={kolon.align ?? "left"} sx={headerCellSx}>{kolon.baslik}</TableCell>
                            ))}
                            <TableCell align="right" sx={headerCellSx}>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sayfadakiler.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={kolonlar.length + 1} sx={{ textAlign: "center", py: 6 }}>
                                    <PeopleAltIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                                    <Typography color="text.secondary">
                                        {arama ? "Aramanıza uygun sonuç bulunamadı." : (bosMetin ?? "Henüz kayıt yok.")}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sayfadakiler.map((k) => (
                                <TableRow key={k.id} hover sx={{ "&:last-child td": { border: 0 }, transition: "background-color 0.15s" }}>
                                    {kolonlar.map((kolon, i) => (
                                        <TableCell key={i} align={kolon.align ?? "left"}>{kolon.render(k)}</TableCell>
                                    ))}
                                    <TableCell align="right">
                                        <Tooltip title="Görüntüle">
                                            <IconButton size="small" color="primary" onClick={() => onView?.(k)}>
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Düzenle">
                                            <IconButton size="small" color="info" onClick={() => onEdit?.(k)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Sil">
                                            <IconButton size="small" color="error" onClick={() => onDelete?.(k)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {filtrelenmis.length > 5 && (
                    <TablePagination
                        component="div"
                        count={filtrelenmis.length}
                        page={sayfa}
                        onPageChange={(_, yeniSayfa) => setSayfa(yeniSayfa)}
                        rowsPerPage={sayfaBoyutu}
                        onRowsPerPageChange={(e) => { setSayfaBoyutu(parseInt(e.target.value, 10)); setSayfa(0); }}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Sayfa başına:"
                        labelDisplayedRows={({ from, to, count }) => `${from}–${to} / ${count}`}
                    />
                )}
            </TableContainer>
        </Box>
    );
}

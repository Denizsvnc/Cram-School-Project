import React, { useState, useEffect } from 'react';
import {
    Drawer, Box, Typography, IconButton, Divider,
    TextField, Button, Avatar, Chip, Grid, alpha, useTheme,
    InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import type { Kullanici } from '../services/types/kullanici.types';

interface KullaniciDrawerProps {
    open: boolean;
    onClose: () => void;
    user: Kullanici | null;
    mode: 'view' | 'edit' | 'create';
    onSave: (updatedUser: Partial<Kullanici>) => Promise<void>;
    roleTitle: string;
}

const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 55%, 50%)`;
};

export const KullaniciDrawer: React.FC<KullaniciDrawerProps> = ({
    open, onClose, user, mode, onSave, roleTitle
}) => {
    const theme = useTheme();
    const [formData, setFormData] = useState<Partial<Kullanici>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [veliListesi, setVeliListesi] = useState<Kullanici[]>([]);
    const [ogrenciListesi, setOgrenciListesi] = useState<Kullanici[]>([]);

    useEffect(() => {
        if (mode === 'create') {
            const defaultRol = user?.rol || 'OGRENCI';
            setFormData({
                rol: defaultRol,
                password: '',
                isim: '',
                soy_isim: '',
                mail: '',
                tel_no: '',
                tc_no: '',
                dogum_tarihi: '',
                egitim_durumu: '',
                ...(defaultRol === 'OGRENCI' ? { odeme_plani: 'Peşin', odeme_durumu: false, odeme_tutari: undefined, taksit_sayisi: undefined } : {}),
                ...(defaultRol === 'OGRETMEN' || defaultRol === 'MUDUR' || defaultRol === 'PERSONEL' ? { maas: '0', maas_odendi_mi: false, izin_hakki: 14, kullanilan_izin: 0 } : {})
            });
        } else if (user) {
            setFormData({ ...user });
        } else {
            setFormData({});
        }
    }, [user, mode, open]);

    useEffect(() => {
        const fetchLinks = async () => {
            if (!open) return;
            const { KullaniciService } = await import('../services/kullaniciApi');
            
            if (user?.rol === 'OGRENCI' || formData.rol === 'OGRENCI') {
                try {
                    const data = await KullaniciService.getVeliler();
                    setVeliListesi(data.veliler || []);
                } catch (error) {
                    console.error("Veli listesi yüklenemedi:", error);
                }
            }

            if (user?.rol === 'VELI' || formData.rol === 'VELI') {
                try {
                    const data = await KullaniciService.getOgrenciler();
                    setOgrenciListesi(data.ogrenciler || []);
                } catch (error) {
                    console.error("Öğrenci listesi yüklenemedi:", error);
                }
            }
        };
        fetchLinks();
    }, [open, user?.rol, formData.rol]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name as string]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error("Kaydetme hatası:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const isView = mode === 'view';
    const isCreate = mode === 'create';
    
    if (!open) return null;
    if (!user && !isCreate) return null;

    const displayUser = isCreate ? formData : user;
    if (!displayUser && !isCreate) return null;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: '100%', sm: 450, md: 500 }, p: 0 }
            }}
        >
            {/* Header */}
            <Box sx={{ 
                p: 3, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        {isCreate ? `${roleTitle} Ekle` : (isView ? 'Kullanıcı Detayı' : 'Kullanıcıyı Düzenle')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {roleTitle} Yönetimi
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ p: 4, overflowY: 'auto' }}>
                {!isCreate && user && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        <Avatar
                            sx={{
                                width: 100, height: 100, mb: 2, fontSize: '2.5rem', fontWeight: 700,
                                bgcolor: stringToColor(user.isim + user.soy_isim),
                                boxShadow: `0 8px 16px ${alpha(stringToColor(user.isim + user.soy_isim), 0.3)}`
                            }}
                        >
                            {user.isim[0]}{user.soy_isim[0]}
                        </Avatar>
                        <Typography variant="h5" fontWeight={700}>
                            {user.isim} {user.soy_isim}
                        </Typography>
                        <Chip 
                            label={user.rol} 
                            size="small" 
                            color="primary" 
                            sx={{ mt: 1, fontWeight: 600, borderRadius: 1.5 }} 
                        />
                    </Box>
                )}

                {isCreate && (
                    <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom sx={{ mb: 3 }}>
                        Yeni {roleTitle} Bilgileri
                    </Typography>
                )}

                {!isCreate && <Divider sx={{ mb: 4 }} />}

                <Grid container spacing={3}>
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="İsim"
                            name="isim"
                            value={formData.isim || ''}
                            onChange={handleChange}
                            disabled={isView}
                            variant="outlined"
                            inputProps={{ maxLength: 70 }}
                            required
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="Soyisim"
                            name="soy_isim"
                            value={formData.soy_isim || ''}
                            onChange={handleChange}
                            disabled={isView}
                            variant="outlined"
                            inputProps={{ maxLength: 70 }}
                            required
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="E-posta"
                            name="mail"
                            value={formData.mail || ''}
                            onChange={handleChange}
                            disabled={isView}
                            variant="outlined"
                            required
                            size="small"
                        />
                    </Grid>
                    {isCreate && (
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Şifre"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password || ''}
                                onChange={handleChange}
                                variant="outlined"
                                required
                                size="small"
                                inputProps={{ minLength: 6 }}
                                helperText="Kullanıcının giriş yapabilmesi için en az 6 karakterli bir şifre belirleyin."
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(prev => !prev)}
                                                edge="end"
                                                size="small"
                                            >
                                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                    )}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Telefon"
                            name="tel_no"
                            value={formData.tel_no || ''}
                            onChange={handleChange}
                            disabled={isView}
                            variant="outlined"
                            inputProps={{ maxLength: 15 }}
                            required
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="TC Kimlik No"
                            name="tc_no"
                            value={formData.tc_no || ''}
                            onChange={handleChange}
                            disabled={isView}
                            variant="outlined"
                            inputProps={{ maxLength: 11 }}
                            required
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Doğum Tarihi"
                            name="dogum_tarihi"
                            type="date"
                            value={formData.dogum_tarihi ? (typeof formData.dogum_tarihi === 'string' ? formData.dogum_tarihi.split('T')[0] : '') : ''}
                            onChange={handleChange}
                            disabled={isView}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            required
                            size="small"
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Eğitim Durumu"
                            name="egitim_durumu"
                            value={formData.egitim_durumu || ''}
                            onChange={handleChange}
                            disabled={isView}
                            variant="outlined"
                            required
                            size="small"
                        />
                    </Grid>

                    {/* Rol bazlı özel alanlar */}
                    {(user?.rol === 'OGRENCI' || formData.rol === 'OGRENCI') && (
                        <>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Ödeme Planı"
                                    name="odeme_plani"
                                    value={formData.odeme_plani || ''}
                                    onChange={handleChange}
                                    disabled={isView}
                                    variant="outlined"
                                    required={isCreate}
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Ödeme Durumu"
                                    name="odeme_durumu"
                                    value={formData.odeme_durumu ? 'true' : 'false'}
                                    onChange={(e) => setFormData(prev => ({ ...prev, odeme_durumu: e.target.value === 'true' }))}
                                    disabled={isView}
                                    variant="outlined"
                                    SelectProps={{ native: true }}
                                    size="small"
                                >
                                    <option value="false">Ödenmedi</option>
                                    <option value="true">Ödendi</option>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Ödeme Tutarı (₺)"
                                    name="odeme_tutari"
                                    type="number"
                                    value={formData.odeme_tutari ?? ''}
                                    onChange={handleChange}
                                    disabled={isView}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Taksit Sayısı (Ay)"
                                    name="taksit_sayisi"
                                    type="number"
                                    value={formData.taksit_sayisi ?? ''}
                                    onChange={handleChange}
                                    disabled={isView}
                                    variant="outlined"
                                    size="small"
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Veli Seç"
                                    name="veli_ID"
                                    value={formData.veli_ID || ''}
                                    onChange={handleChange}
                                    disabled={isView}
                                    variant="outlined"
                                    SelectProps={{ native: true }}
                                    size="small"
                                >
                                    <option value="">Seçiniz...</option>
                                    {veliListesi.map(v => (
                                        <option key={v.id} value={v.id}>{v.isim} {v.soy_isim}</option>
                                    ))}
                                </TextField>
                            </Grid>
                        </>
                    )}

                    {(user?.rol === 'VELI' || formData.rol === 'VELI') && (
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                select
                                label="Öğrenci Seç (Birden fazla seçilebilir)"
                                name="ogrenci_ids"
                                value={formData.ogrenci_ids || []}
                                onChange={(e) => {
                                    const options = (e.target as any).options;
                                    const value: string[] = [];
                                    for (let i = 0, l = options.length; i < l; i++) {
                                        if (options[i].selected) {
                                            value.push(options[i].value);
                                        }
                                    }
                                    setFormData(prev => ({ ...prev, ogrenci_ids: value }));
                                }}
                                disabled={isView}
                                variant="outlined"
                                SelectProps={{ native: true, multiple: true, sx: { height: 120 } }}
                                size="small"
                                helperText="Ctrl (veya Cmd) tuşuna basılı tutarak çoklu seçim yapabilirsiniz."
                            >
                                {ogrenciListesi.map(o => (
                                    <option key={o.id} value={o.id}>{o.isim} {o.soy_isim} (No: {o.ogrenciNo})</option>
                                ))}
                            </TextField>
                        </Grid>
                    )}

                    {(['OGRETMEN', 'MUDUR', 'PERSONEL'].includes(user?.rol || formData.rol || '')) && (
                        <>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Maaş"
                                    name="maas"
                                    value={formData.maas || ''}
                                    onChange={handleChange}
                                    disabled={isView}
                                    variant="outlined"
                                    required={isCreate}
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Maaş Ödendi Mi"
                                    name="maas_odendi_mi"
                                    value={formData.maas_odendi_mi ? 'true' : 'false'}
                                    onChange={(e) => setFormData(prev => ({ ...prev, maas_odendi_mi: e.target.value === 'true' }))}
                                    disabled={isView}
                                    variant="outlined"
                                    SelectProps={{ native: true }}
                                    size="small"
                                >
                                    <option value="false">Ödenmedi</option>
                                    <option value="true">Ödendi</option>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    fullWidth
                                    label="İzin Hakkı (Gün)"
                                    name="izin_hakki"
                                    type="number"
                                    value={formData.izin_hakki ?? ''}
                                    onChange={handleChange}
                                    disabled={isView}
                                    variant="outlined"
                                    size="small"
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Kullanılan İzin (Gün)"
                                    name="kullanilan_izin"
                                    type="number"
                                    value={formData.kullanilan_izin ?? ''}
                                    onChange={handleChange}
                                    disabled={isView}
                                    variant="outlined"
                                    size="small"
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>

                {!isView && (
                    <Box sx={{ mt: 6, display: 'flex', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={isSaving ? null : <SaveIcon />}
                            onClick={handleSave}
                            disabled={isSaving}
                            sx={{ borderRadius: 2, py: 1.5, fontWeight: 700 }}
                        >
                            {isSaving ? 'Kaydediliyor...' : (isCreate ? 'Oluştur' : 'Değişiklikleri Kaydet')}
                        </Button>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

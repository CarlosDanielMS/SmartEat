import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';

export function useAccountPrivacy() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [goal, setGoal] = useState('maintain_weight');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone, quiz_data')
          .eq('id', user.id)
          .single();
        if (error) throw error;

        setFullName(data?.full_name || '');
        setPhone(data?.phone || '');
        setGoal(data?.quiz_data?.['2'] || 'maintain_weight');
      } catch (e) {
        console.error(e);
        Alert.alert('Erro', 'Não foi possível carregar seus dados.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    try {
      setSaving(true);

      // carrega quiz_data atual
      const { data: current, error: loadErr } = await supabase
        .from('profiles')
        .select('quiz_data')
        .eq('id', user.id)
        .single();
      if (loadErr) throw loadErr;

      const newQuiz = { ...(current?.quiz_data || {}), ['2']: goal };

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          phone: phone.trim(),
          quiz_data: newQuiz,
        })
        .eq('id', user.id);

      if (error) throw error;
      Alert.alert('Sucesso', 'Dados atualizados com sucesso.');
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Atenção', 'Digite uma nova senha.');
      return;
    }
    try {
      setSaving(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword.trim(),
      });
      if (error) throw error;
      setNewPassword('');
      Alert.alert('Sucesso', 'Senha alterada com sucesso.');
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível alterar a senha.');
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    fullName,
    setFullName,
    phone,
    setPhone,
    goal,
    setGoal,
    newPassword,
    setNewPassword,
    handleSaveProfile,
    handleChangePassword,
  };
}

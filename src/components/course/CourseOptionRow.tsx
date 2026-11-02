import React, { memo } from 'react';
import AppButton from '../common/AppButton';
import type { EntityId, FilterOption } from '../../types/models';

/** option, onPress bắt buộc; selected mặc định false. */
export default memo(function CourseOptionRow({
  option,
  onPress,
  selected = false,
}: {
  option: FilterOption<EntityId>;
  onPress: () => void;
  selected?: boolean;
}) {
  return (
    <AppButton
      title={`${selected ? 'Đã chọn · ' : ''}${option.label}`}
      variant={selected ? 'primary' : 'outline'}
      onPress={onPress}
    />
  );
});

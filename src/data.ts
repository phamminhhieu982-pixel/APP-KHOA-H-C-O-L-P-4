import { Badge, ScienceModule, QuizQuestion, PlanetDetailsMap } from './types.ts';

export const HUY_HIEU_LIST: Badge[] = [
  { id: 'tap_su', name: 'Nhà khoa học tập sự', icon: '🥉', desc: 'Đạt tối thiểu 10 điểm khoa học!', minPoints: 10 },
  { id: 'nhi', name: 'Nhà nghiên cứu nhí', icon: '🥈', desc: 'Đạt tối thiểu 50 điểm khoa học!', minPoints: 50 },
  { id: 'xuat_sac', name: 'Nhà khoa học xuất sắc', icon: '🥇', desc: 'Đạt tối thiểu 150 điểm khoa học!', minPoints: 150 }
];

export const MODULE_DATA: ScienceModule[] = [
  { id: 'evaporation', name: '💧 Nước Bốc Hơi', desc: 'Khám phá sự chuyển thể kỳ diệu của nước dưới tác động nhiệt.', color: 'from-blue-400 to-indigo-500' },
  { id: 'water-cycle', name: '☁️ Chu Trình Nước', desc: 'Đồng hành cùng giọt nước qua hành trình khép kín tự nhiên.', color: 'from-sky-400 to-blue-600' },
  { id: 'solar-system', name: '🪐 Hệ Mặt Trời', desc: 'Du hành vũ trụ 3D, khám phá Mặt Trời và 8 hành tinh.', color: 'from-purple-600 to-indigo-900' },
  { id: 'plant-growth', name: '🌱 Thực Vật Phát Triển', desc: 'Trở thành nhà sinh vật học nhí gieo mầm sự sống.', color: 'from-emerald-400 to-green-600' }
];

export const EVAPORATION_QUIZ: QuizQuestion[] = [
  { q: "Hiện tượng nước chuyển từ thể lỏng sang thể khí (hơi) gọi là gì?", a: ["Sự ngưng tụ", "Sự bốc hơi", "Sự đông đặc", "Sự nóng chảy"], correct: 1 },
  { q: "Nhiệt độ ảnh hưởng thế nào đến tốc độ bốc hơi của nước?", a: ["Nhiệt độ càng cao bốc hơi càng nhanh", "Nhiệt độ càng cao bốc hơi càng chậm", "Nhiệt độ không ảnh hưởng", "Nhiệt độ cực lạnh nước bốc hơi nhanh nhất"], correct: 0 },
  { q: "Nguồn nhiệt tự nhiên lớn nhất làm nước sông, hồ, biển bốc hơi là gì?", a: ["Lửa lò sưởi", "Mặt Trời", "Đèn hồng ngoại", "Năng lượng gió"], correct: 1 },
  { q: "Khi đun sôi nước đến 100°C, hiện tượng gì xảy ra dữ dội?", a: ["Nước đóng băng lập tức", "Nước sôi sùng sục và bốc hơi rất nhanh", "Nước đổi màu sang xanh lam", "Không có hơi nước thoát ra"], correct: 1 },
  { q: "Độ ẩm không khí khô ráo kết hợp gió mạnh sẽ làm nước bốc hơi như thế nào?", a: ["Chậm đi rất nhiều", "Nhanh hơn", "Ngừng bốc hơi hoàn toàn", "Chuyển thành đá tuyết"], correct: 1 }
];

export const PLANET_DETAILS: PlanetDetailsMap = {
  'Mặt Trời': { dist: '0 triệu km', fact: 'Là một ngôi sao khổng lồ, nguồn năng lượng sưởi ấm toàn bộ Hệ Mặt Trời.', color: '#ef4444', size: 30 },
  'Sao Thủy': { dist: '57.9 triệu km', fact: 'Hành tinh nhỏ nhất và gần Mặt Trời nhất, ban ngày cực nóng, ban đêm cực lạnh.', color: '#9ca3af', size: 8 },
  'Sao Kim': { dist: '108.2 triệu km', fact: 'Hành tinh nóng nhất Hệ Mặt Trời do bầu khí quyển giữ nhiệt cực mạnh.', color: '#fbbf24', size: 12 },
  'Trái Đất': { dist: '149.6 triệu km', fact: 'Ngôi nhà của chúng ta, hành tinh duy nhất được biết có sự sống và nước lỏng bao phủ.', color: '#3b82f6', size: 14 },
  'Sao Hỏa': { dist: '227.9 triệu km', fact: 'Được gọi là Hành tinh Đỏ do đất đá chứa nhiều sắt rỉ sét.', color: '#f97316', size: 10 },
  'Sao Mộc': { dist: '778.5 triệu km', fact: 'Hành tinh khí khổng lồ lớn nhất, có vết bão lớn màu đỏ kéo dài hàng thế kỷ.', color: '#d97706', size: 24 },
  'Sao Thổ': { dist: '1.43 tỷ km', fact: 'Nổi tiếng với hệ thống vành đai băng và đá bụi tuyệt đẹp xung quanh.', color: '#eab308', size: 20 },
  'Sao Thiên Vương': { dist: '2.87 tỷ km', fact: 'Hành tinh băng khổng lồ màu xanh lam nhạt, tự quay quanh trục theo phương nằm ngang.', color: '#22d3ee', size: 16 },
  'Sao Hải Vương': { dist: '4.5 tỷ km', fact: 'Hành tinh xa Mặt Trời nhất, màu xanh dương sẫm, chịu những cơn cuồng phong mạnh nhất.', color: '#1d4ed8', size: 16 }
};

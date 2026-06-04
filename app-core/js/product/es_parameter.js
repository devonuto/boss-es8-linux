/**
 * @file        parameter.js
 * @brief       パラメータ定義
 * @author      umano
 * @date        2016.10.19
 * @copyright   Copyright(c) 2016 Roland Corporation
 */

/**
 * @brief   パラメータのフォーム表示文字列
 */
const prmstr = new function () {
    this.numstring = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
        '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
        '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
        '50', '51', '52', '53', '54', '55', '56', '57', '58', '59',
        '60', '61', '62', '63', '64', '65', '66', '67', '68', '69',
        '70', '71', '72', '73', '74', '75', '76', '77', '78', '79',
        '80', '81', '82', '83', '84', '85', '86', '87', '88', '89',
        '90', '91', '92', '93', '94', '95', '96', '97', '98', '99',
        '100', '101', '102', '103', '104', '105', '106', '107', '108', '109',
        '110', '111', '112', '113', '114', '115', '116', '117', '118', '119',
        '120', '121', '122', '123', '124', '125', '126', '127', '128', '129',
        '130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
        '140', '141', '142', '143', '144', '145', '146', '147', '148', '149',
        '150', '151', '152', '153', '154', '155', '156', '157', '158', '159',
        '160', '161', '162', '163', '164', '165', '166', '167', '168', '169',
        '170', '171', '172', '173', '174', '175', '176', '177', '178', '179',
        '180', '181', '182', '183', '184', '185', '186', '187', '188', '189',
        '190', '191', '192', '193', '194', '195', '196', '197', '198', '199',
        '200', '201', '202', '203', '204', '205', '206', '207', '208', '209',
        '210', '211', '212', '213', '214', '215', '216', '217', '218', '219',
        '220', '221', '222', '223', '224', '225', '226', '227', '228', '229',
        '230', '231', '232', '233', '234', '235', '236', '237', '238', '239',
        '240', '241', '242', '243', '244', '245', '246', '247', '248', '249',
        '250', '251', '252', '253', '254', '255', '256', '257', '258', '259',
        '260', '261', '262', '263', '264', '265', '266', '267', '268', '269',
        '270', '271', '272', '273', '274', '275', '276', '277', '278', '279',
        '280', '281', '282', '283', '284', '285', '286', '287', '288', '289',
        '290', '291', '292', '293', '294', '295', '296', '297', '298', '299',
        '300', '301', '302', '303', '304', '305', '306', '307', '308', '309',
        '310', '311', '312', '313', '314', '315', '316', '317', '318', '319',
        '320', '321', '322', '323', '324', '325', '326', '327', '328', '329',
        '330', '331', '332', '333', '334', '335', '336', '337', '338', '339',
        '340', '341', '342', '343', '344', '345', '346', '347', '348', '349',
        '350', '351', '352', '353', '354', '355', '356', '357', '358', '359',
        '360', '361', '362', '363', '364', '365', '366', '367', '368', '369',
        '370', '371', '372', '373', '374', '375', '376', '377', '378', '379',
        '380', '381', '382', '383', '384', '385', '386', '387', '388', '389',
        '390', '391', '392', '393', '394', '395', '396', '397', '398', '399',
        '400', '401', '402', '403', '404', '405', '406', '407', '408', '409',
        '410', '411', '412', '413', '414', '415', '416', '417', '418', '419',
        '420', '421', '422', '423', '424', '425', '426', '427', '428', '429',
        '430', '431', '432', '433', '434', '435', '436', '437', '438', '439',
        '440', '441', '442', '443', '444', '445', '446', '447', '448', '449',
        '450', '451', '452', '453', '454', '455', '456', '457', '458', '459',
        '460', '461', '462', '463', '464', '465', '466', '467', '468', '469',
        '470', '471', '472', '473', '474', '475', '476', '477', '478', '479',
        '480', '481', '482', '483', '484', '485', '486', '487', '488', '489',
        '490', '491', '492', '493', '494', '495', '496', '497', '498', '499',
        '500'
    ];
    this.CC = [
        'CC000', 'CC001', 'CC002', 'CC003', 'CC004', 'CC005', 'CC006', 'CC007', 'CC008', 'CC009',
        'CC010', 'CC011', 'CC012', 'CC013', 'CC014', 'CC015', 'CC016', 'CC017', 'CC018', 'CC019',
        'CC020', 'CC021', 'CC022', 'CC023', 'CC024', 'CC025', 'CC026', 'CC027', 'CC028', 'CC029',
        'CC030', 'CC031', 'CC032', 'CC033', 'CC034', 'CC035', 'CC036', 'CC037', 'CC038', 'CC039',
        'CC040', 'CC041', 'CC042', 'CC043', 'CC044', 'CC045', 'CC046', 'CC047', 'CC048', 'CC049',
        'CC050', 'CC051', 'CC052', 'CC053', 'CC054', 'CC055', 'CC056', 'CC057', 'CC058', 'CC059',
        'CC060', 'CC061', 'CC062', 'CC063', 'CC064', 'CC065', 'CC066', 'CC067', 'CC068', 'CC069',
        'CC070', 'CC071', 'CC072', 'CC073', 'CC074', 'CC075', 'CC076', 'CC077', 'CC078', 'CC079',
        'CC080', 'CC081', 'CC082', 'CC083', 'CC084', 'CC085', 'CC086', 'CC087', 'CC088', 'CC089',
        'CC090', 'CC091', 'CC092', 'CC093', 'CC094', 'CC095', 'CC096', 'CC097', 'CC098', 'CC099',
        'CC100', 'CC101', 'CC102', 'CC103', 'CC104', 'CC105', 'CC106', 'CC107', 'CC108', 'CC109',
        'CC110', 'CC111', 'CC112', 'CC113', 'CC114', 'CC115', 'CC116', 'CC117', 'CC118', 'CC119',
        'CC120', 'CC121', 'CC122', 'CC123', 'CC124', 'CC125', 'CC126', 'CC127'
    ];
    this.OffOn = ['OFF', 'ON'];
    this.patchNum = [
        '001', '002', '003', '004', '005', '006', '007', '008',
        '011', '012', '013', '014', '015', '016', '017', '018',
        '021', '022', '023', '024', '025', '026', '027', '028',
        '031', '032', '033', '034', '035', '036', '037', '038',
        '041', '042', '043', '044', '045', '046', '047', '048',
        '051', '052', '053', '054', '055', '056', '057', '058',
        '061', '062', '063', '064', '065', '066', '067', '068',
        '071', '072', '073', '074', '075', '076', '077', '078',
        '081', '082', '083', '084', '085', '086', '087', '088',
        '091', '092', '093', '094', '095', '096', '097', '098',
        '101', '102', '103', '104', '105', '106', '107', '108',
        '111', '112', '113', '114', '115', '116', '117', '118',
        '121', '122', '123', '124', '125', '126', '127', '128',
        '131', '132', '133', '134', '135', '136', '137', '138',
        '141', '142', '143', '144', '145', '146', '147', '148',
        '151', '152', '153', '154', '155', '156', '157', '158',
        '161', '162', '163', '164', '165', '166', '167', '168',
        '171', '172', '173', '174', '175', '176', '177', '178',
        '181', '182', '183', '184', '185', '186', '187', '188',
        '191', '192', '193', '194', '195', '196', '197', '198',
        '201', '202', '203', '204', '205', '206', '207', '208',
        '211', '212', '213', '214', '215', '216', '217', '218',
        '221', '222', '223', '224', '225', '226', '227', '228',
        '231', '232', '233', '234', '235', '236', '237', '238',
        '241', '242', '243', '244', '245', '246', '247', '248',
        '251', '252', '253', '254', '255', '256', '257', '258',
        '261', '262', '263', '264', '265', '266', '267', '268',
        '271', '272', '273', '274', '275', '276', '277', '278',
        '281', '282', '283', '284', '285', '286', '287', '288',
        '291', '292', '293', '294', '295', '296', '297', '298',
        '301', '302', '303', '304', '305', '306', '307', '308',
        '311', '312', '313', '314', '315', '316', '317', '318',
        '321', '322', '323', '324', '325', '326', '327', '328',
        '331', '332', '333', '334', '335', '336', '337', '338',
        '341', '342', '343', '344', '345', '346', '347', '348',
        '351', '352', '353', '354', '355', '356', '357', '358',
        '361', '362', '363', '364', '365', '366', '367', '368',
        '371', '372', '373', '374', '375', '376', '377', '378',
        '381', '382', '383', '384', '385', '386', '387', '388',
        '391', '392', '393', '394', '395', '396', '397', '398',
        '401', '402', '403', '404', '405', '406', '407', '408',
        '411', '412', '413', '414', '415', '416', '417', '418',
        '421', '422', '423', '424', '425', '426', '427', '428',
        '431', '432', '433', '434', '435', '436', '437', '438',
        '441', '442', '443', '444', '445', '446', '447', '448',
        '451', '452', '453', '454', '455', '456', '457', '458',
        '461', '462', '463', '464', '465', '466', '467', '468',
        '471', '472', '473', '474', '475', '476', '477', '478',
        '481', '482', '483', '484', '485', '486', '487', '488',
        '491', '492', '493', '494', '495', '496', '497', '498',
        '501', '502', '503', '504', '505', '506', '507', '508',
        '511', '512', '513', '514', '515', '516', '517', '518',
        '521', '522', '523', '524', '525', '526', '527', '528',
        '531', '532', '533', '534', '535', '536', '537', '538',
        '541', '542', '543', '544', '545', '546', '547', '548',
        '551', '552', '553', '554', '555', '556', '557', '558',
        '561', '562', '563', '564', '565', '566', '567', '568',
        '571', '572', '573', '574', '575', '576', '577', '578',
        '581', '582', '583', '584', '585', '586', '587', '588',
        '591', '592', '593', '594', '595', '596', '597', '598',
        '601', '602', '603', '604', '605', '606', '607', '608',
        '611', '612', '613', '614', '615', '616', '617', '618',
        '621', '622', '623', '624', '625', '626', '627', '628',
        '631', '632', '633', '634', '635', '636', '637', '638',
        '641', '642', '643', '644', '645', '646', '647', '648',
        '651', '652', '653', '654', '655', '656', '657', '658',
        '661', '662', '663', '664', '665', '666', '667', '668',
        '671', '672', '673', '674', '675', '676', '677', '678',
        '681', '682', '683', '684', '685', '686', '687', '688',
        '691', '692', '693', '694', '695', '696', '697', '698',
        '701', '702', '703', '704', '705', '706', '707', '708',
        '711', '712', '713', '714', '715', '716', '717', '718',
        '721', '722', '723', '724', '725', '726', '727', '728',
        '731', '732', '733', '734', '735', '736', '737', '738',
        '741', '742', '743', '744', '745', '746', '747', '748',
        '751', '752', '753', '754', '755', '756', '757', '758',
        '761', '762', '763', '764', '765', '766', '767', '768',
        '771', '772', '773', '774', '775', '776', '777', '778',
        '781', '782', '783', '784', '785', '786', '787', '788',
        '791', '792', '793', '794', '795', '796', '797', '798',
        '801', '802', '803', '804', '805', '806', '807', '808',
        '811', '812', '813', '814', '815', '816', '817', '818',
        '821', '822', '823', '824', '825', '826', '827', '828',
        '831', '832', '833', '834', '835', '836', '837', '838',
        '841', '842', '843', '844', '845', '846', '847', '848',
        '851', '852', '853', '854', '855', '856', '857', '858',
        '861', '862', '863', '864', '865', '866', '867', '868',
        '871', '872', '873', '874', '875', '876', '877', '878',
        '881', '882', '883', '884', '885', '886', '887', '888',
        '891', '892', '893', '894', '895', '896', '897', '898',
        '901', '902', '903', '904', '905', '906', '907', '908',
        '911', '912', '913', '914', '915', '916', '917', '918',
        '921', '922', '923', '924', '925', '926', '927', '928',
        '931', '932', '933', '934', '935', '936', '937', '938',
        '941', '942', '943', '944', '945', '946', '947', '948',
        '951', '952', '953', '954', '955', '956', '957', '958',
        '961', '962', '963', '964', '965', '966', '967', '968',
        '971', '972', '973', '974', '975', '976', '977', '978',
        '981', '982', '983', '984', '985', '986', '987', '988',
        '991', '992', '993', '994', '995', '996', '997', '998',
    ];

    this.ID_SYSTEM_CURRENT_NUM = [];
    this.ID_SYSTEM_PANEL_LOCK = [];
    this.ID_SYSTEM_PLAY_OPTION_SW_MODE = ['PUSH', 'RELEASE'];
    this.ID_SYSTEM_PLAY_OPTION_BANK_CHANGE_MODE = ['WAIT', 'IMMEDIATE'];
    this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL1 = ['LAT', 'PLS', 'INV', 'TP2', 'TP3', 'TP4'];
    this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL2 = this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL1;
    this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL3 = this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL1;
    this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL4 = this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL1;
    this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL5 = this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL1;
    this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL6 = this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL1;
    this.ID_SYSTEM_PLAY_OPTION_BANK_EXTENT_MIN = this.numstring.slice(0, 100);
    this.ID_SYSTEM_PLAY_OPTION_BANK_EXTENT_MAX =  this.numstring.slice(0, 100);
    this.ID_SYSTEM_PLAY_OPTION_PATCH_CHANGE_TIME =  this.numstring.slice(0, 11);
    this.ID_SYSTEM_PREFERENCE_INPUT_SELECT = ['PAT', '1', '2'];
    this.ID_SYSTEM_PREFERENCE_INPUT_BUFFER = ['PAT', 'OFF', 'ON'];
    this.ID_SYSTEM_PREFERENCE_OUTPUT_SELECT = ['PAT', '1', '2', '1&2'];
    this.ID_SYSTEM_PREFERENCE_OUTPUT_BUFFER = ['PAT', 'OFF', 'ON'];
    this.ID_SYSTEM_PREFERENCE_LOOP7_RETURN_MODE = ['MONO', 'STEREO'];
    this.ID_SYSTEM_PREFERENCE_LOOP8_RETURN_MODE = ['MONO', 'STEREO'];
    this.ID_SYSTEM_PREFERENCE_VOLUME_LOOP_LIFT = ['GND', 'LIFT'];
    this.ID_SYSTEM_MIDI_SETTING_MIDI_OUT_MODE = ['OUT', 'THRU'];
    this.ID_SYSTEM_MIDI_SETTING_RX_CH = this.numstring.slice(1, 17);
    this.ID_SYSTEM_MIDI_SETTING_DEVICE_ID = this.numstring.slice(1, 33);
    this.ID_SYSTEM_MIDI_SETTING_SYNC_CLOCK = ['INT', 'AUTO'];
    this.ID_SYSTEM_MIDI_SETTING_CLOCK_OUT = this.OffOn;
    this.ID_SYSTEM_OTHERS_LCD_CONTRAST = this.numstring.slice(1, 11);
    this.ID_SYSTEM_OTHERS_EXP1_POLARITY = ['ST', 'IN'];
    this.ID_SYSTEM_OTHERS_EXP2_POLARITY = this.ID_SYSTEM_OTHERS_EXP1_POLARITY;
    this.ID_SYSTEM_OTHERS_CTL1_POLARITY = this.ID_SYSTEM_OTHERS_EXP1_POLARITY;
    this.ID_SYSTEM_OTHERS_CTL2_POLARITY = this.ID_SYSTEM_OTHERS_EXP1_POLARITY;
    this.ID_SYSTEM_OTHERS_CTL3_POLARITY = this.ID_SYSTEM_OTHERS_EXP1_POLARITY;
    this.ID_SYSTEM_OTHERS_CTL4_POLARITY = this.ID_SYSTEM_OTHERS_EXP1_POLARITY;
    this.ID_SYSTEM_PREFERENCE_MEMORY_MANUAL_SW_MODE = [];
    this.ID_SYSTEM_PREFERENCE_MUTE_BYPASS_SW_MODE = [];
    this.ID_SYSTEM_MEMORY_MANUAL = [];
    this.ID_SYSTEM_CTL_SW = ['PAT','SYS'];
    this.ID_SYSTEM_CTL_FUNC = ['OFF','MemM','Mute','BnkD','BnkU','MemU','MemD','Num1','Num2','Num3','Num4','Num5','Num6','Num7','Num8','Ctl1','Ctl2','Ctl3','Ctl4','Ctl5','Ctl6','BPM'];
    this.ID_SYSTEM_CTL_MIN = [
        [],             // OFF
        [],             // MemM
        [],             // Mute
        [],             // BnkD
        [],             // BnkU
        [],             // MemU
        [],             // MemD
        [],             // Num1
        [],             // Num2
        [],             // Num3
        [],             // Num4
        [],             // Num5
        [],             // Num6
        [],             // Num7
        [],             // Num8
        this.OffOn,     // Ctl1
        this.OffOn,     // Ctl2
        this.OffOn,     // Ctl3
        this.OffOn,     // Ctl4
        this.OffOn,     // Ctl5
        this.OffOn,     // Ctl6
        [],             // BPM
    ];
    this.ID_SYSTEM_CTL_MAX = this.ID_SYSTEM_CTL_MIN;
    this.ID_SYSTEM_CTL_MOD =[
        [],             // OFF
        [],             // MemM
        [],             // Mute
        [],             // BnkD
        [],             // BnkU
        [],             // MemU
        [],             // MemD
        [],             // Num1
        [],             // Num2
        [],             // Num3
        [],             // Num4
        [],             // Num5
        [],             // Num6
        [],             // Num7
        [],             // Num8
        ['MON', 'TGL'], // Ctl1
        ['MON', 'TGL'], // Ctl2
        ['MON', 'TGL'], // Ctl3
        ['MON', 'TGL'], // Ctl4
        ['MON', 'TGL'], // Ctl5
        ['MON', 'TGL'], // Ctl6
        [],             // BPM
    ];
    this.ID_SYSTEM_EXP_SW = ['PAT','SYS'];
    this.ID_SYSTEM_EXP_FUNC = ['OFF','EXP1','EXP2','BPM'];
    this.ID_SYSTEM_EXP_MIN = [
        [],
        [],
        [],
        (new Array(20)).concat(this.numstring.slice(20)),
    ];
    this.ID_SYSTEM_EXP_MAX = this.ID_SYSTEM_EXP_MIN;
    this.ID_SYSTEM_MANUAL_NUMBER1 = ['OFF'].concat(this.numstring.slice(1, 9));
    this.ID_SYSTEM_MANUAL_NUMBER2 = this.ID_SYSTEM_MANUAL_NUMBER1;
    this.ID_SYSTEM_MANUAL_NUMBER3 = this.ID_SYSTEM_MANUAL_NUMBER1;
    this.ID_SYSTEM_MANUAL_NUMBER4 = this.ID_SYSTEM_MANUAL_NUMBER1;
    this.ID_SYSTEM_MANUAL_NUMBER5 = this.ID_SYSTEM_MANUAL_NUMBER1;
    this.ID_SYSTEM_MANUAL_NUMBER6 = this.ID_SYSTEM_MANUAL_NUMBER1;
    this.ID_SYSTEM_MANUAL_NUMBER7 = this.ID_SYSTEM_MANUAL_NUMBER1;
    this.ID_SYSTEM_MANUAL_NUMBER8 = this.ID_SYSTEM_MANUAL_NUMBER1;
    this.ID_SYSTEM_TEMPO_HOLD = this.OffOn;
    this.ID_SYSTEM_LINK = ['OFF', 'ON', 'AUTO'];
    this.ID_SYSTEM_PC_MAP_BANK0_PC = this.patchNum;
    this.ID_SYSTEM_PC_MAP_BANK1_PC = this.patchNum;
    this.ID_SYSTEM_PC_MAP_BANK2_PC = this.patchNum;
    this.ID_SYSTEM_PC_MAP_BANK3_PC = this.patchNum;
    this.ID_SYSTEM_PC_MAP_BANK4_PC = this.patchNum;
    this.ID_SYSTEM_PC_MAP_BANK5_PC = this.patchNum;
    this.ID_SYSTEM_PC_MAP_BANK6_PC = this.patchNum;

    this.ID_PATCH_LOOP_POSITION = ['V', '1', '2', '3', '4', '5', '6', '7', '8', '$', '(', '|', ')', '[', ':', ']'];
    this.ID_PATCH_LOOP_POSITION_IDX = ['1', '2', '3', '4', '5', '6', '7', '8', 'V'];
    this.ID_PATCH_LOOP_SW_LOOP = this.OffOn;
    this.ID_PATCH_CARRY_OVER_LOOP = this.OffOn;
    this.ID_PATCH_CTL1 = [
        this.OffOn,
        this.OffOn,
        this.OffOn,
        [, '1/1', '1/2 D', '1/1 T', '1/2', '1/4 D', '1/2 T', '1/4', '1/8 D', '1/4 T', '1/8', '1/16 D', '1/8 T', '1/16', , , , , , ].concat(this.numstring.slice(20)),
        [, '1/1', '1/2 D', '1/1 T', '1/2', '1/4 D', '1/2 T', '1/4', '1/8 D', '1/4 T', '1/8', '1/16 D', '1/8 T', '1/16', , , , , , ].concat(this.numstring.slice(20)),
        [, '1/1', '1/2 D', '1/1 T', '1/2', '1/4 D', '1/2 T', '1/4', '1/8 D', '1/4 T', '1/8', '1/16 D', '1/8 T', '1/16', , , , , , ].concat(this.numstring.slice(20)),
    ];
    this.ID_PATCH_CTL2 = this.ID_PATCH_CTL1;
    this.ID_PATCH_CTL3 = this.ID_PATCH_CTL1;
    this.ID_PATCH_CTL4 = this.ID_PATCH_CTL1;
    this.ID_PATCH_CTL5 = this.ID_PATCH_CTL1;
    this.ID_PATCH_CTL6 = this.ID_PATCH_CTL1;
    this.ID_PATCH_EXP1 = this.numstring.slice(0,128).concat(['EXP1','EXP2']);
    this.ID_PATCH_EXP2 = this.ID_PATCH_EXP1;
    this.ID_PATCH_MIXER_MODE  = ['AUTO', 'MANUAL'];
    this.ID_PATCH_MIXER_GAIN1 = ['-6dB', '0dB'];
    this.ID_PATCH_MIXER_GAIN2 = ['-6dB', '0dB'];
    this.ID_PATCH_INPUT_SELECT = ['1', '2'];
    this.ID_PATCH_INPUT_BUFFER = this.OffOn;
    this.ID_PATCH_OUTPUT_SELECT = ['1', '2', '1&2'];
    this.ID_PATCH_OUTPUT_BUFFER = this.OffOn;
    this.ID_PATCH_OUTPUT_GAIN = ['0dB',' +2dB', '+4dB', '+6dB'];
    this.ID_PATCH_MASTER_BPM = (new Array(20)).concat(this.numstring.slice(20));
    this.ID_PATCH_LED_NUM1 = this.OffOn;
    this.ID_PATCH_LED_NUM2 = this.OffOn;
    this.ID_PATCH_LED_NUM3 = this.OffOn;
    this.ID_PATCH_LED_NUM4 = this.OffOn;
    this.ID_PATCH_LED_NUM5 = this.OffOn;
    this.ID_PATCH_LED_NUM6 = this.OffOn;
    this.ID_PATCH_LED_NUM7 = this.OffOn;
    this.ID_PATCH_LED_NUM8 = this.OffOn;
    this.ID_PATCH_LED_BANK_D = this.OffOn;
    this.ID_PATCH_LED_BANK_U = this.OffOn;
    this.ID_PATCH_MIDI_TX_CH = ['OFF'].concat(this.numstring.slice(1, 17));
    this.ID_PATCH_MIDI_PC_BANK_LSB = ['OFF'].concat(this.numstring.slice(0, 128));
    this.ID_PATCH_MIDI_PC_BANK_MSB = this.ID_PATCH_MIDI_PC_BANK_LSB;
    this.ID_PATCH_MIDI_PC = ['OFF'].concat(this.numstring.slice(0, 128));
    this.ID_PATCH_MIDI_CTL1_CC = ['OFF'].concat(this.CC);
    this.ID_PATCH_MIDI_CTL1_CC_VAL = this.numstring.slice(0, 128);
    this.ID_PATCH_MIDI_CTL2_CC = this.ID_PATCH_MIDI_CTL1_CC;
    this.ID_PATCH_MIDI_CTL2_CC_VAL = this.ID_PATCH_MIDI_CTL1_CC_VAL;
    this.ID_PATCH_MIDI_CLOCK_OUT = ['SYSTEM','OFF'];
    this.ID_PATCH_MIDI_TRANSMIT  = ['AUTO','MANUAL'];
    this.ID_PATCH_CTL_FUNC = this.ID_SYSTEM_CTL_FUNC;
    this.ID_PATCH_CTL_MIN = this.ID_SYSTEM_CTL_MIN;
    this.ID_PATCH_CTL_MAX = this.ID_SYSTEM_CTL_MAX;
    this.ID_PATCH_CTL_MOD = this.ID_SYSTEM_CTL_MOD;
    this.ID_PATCH_EXP_FUNC = this.ID_SYSTEM_EXP_FUNC;
    this.ID_PATCH_EXP_MIN = this.ID_SYSTEM_EXP_MIN;
    this.ID_PATCH_EXP_MAX = this.ID_SYSTEM_EXP_MAX;
    this.ID_PATCH_ASSIGN_SW = this.OffOn;
    this.ID_PATCH_ASSIGN_SOURCE = ['CTL1', 'CTL2', 'CTL3', 'CTL4', 'MemM', 'Mute', 'BnkD', 'BnkU', 'Num1', 'Num2', 'Num3', 'Num4', 'Num5', 'Num6', 'Num7', 'Num8', 'CNum', 'EXP1', 'EXP2', 'INT', 'WAV', 'CC'];
    this.ID_PATCH_ASSIGN_MODE = ['MOM', 'TGL'];
    this.ID_PATCH_ASSIGN_TARGET = [
        /* LOOP  */ 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'LV',
        /* ECTL  */ 'CTL1', 'CTL2', 'CTL3', 'CTL4', 'CTL5', 'CTL6', 'EXP1', 'EXP2',
        /* InOut */ 'IN', 'OUT',
        /* MODE  */ 'MemM', 'Mute', 'Byps',
        /* MIDI  */ 'MIDI',
        /* BPM   */ 'MstBPM', 'Tap',
        /* LED   */ 'MemM', 'Mute', 'Byps', 'BnkD', 'BnkU', 'Num1', 'Num2', 'Num3', 'Num4', 'Num5', 'Num6', 'Num7', 'Num8', 
        /* Pat.M */ 'PMIDI1', 'PMIDI2', 'PMIDI3', 'PMIDI4', 'PMIDI5', 'PMIDI6', 'PMIDI7', 'PMIDI8'
    ];
    this.ID_PATCH_ASSIGN_TARGET_MIN = [
        this.OffOn,     // LOOP L1
        this.OffOn,     // LOOP L2
        this.OffOn,     // LOOP L3
        this.OffOn,     // LOOP L4
        this.OffOn,     // LOOP L5
        this.OffOn,     // LOOP L6
        this.OffOn,     // LOOP L7
        this.OffOn,     // LOOP L8
        this.OffOn,     // LOOP LV
        this.OffOn,     // ECTL CTL1
        this.OffOn,     // ECTL CTL2
        this.OffOn,     // ECTL CTL3
        this.OffOn,     // ECTL CTL4
        this.OffOn,     // ECTL CTL5
        this.OffOn,     // ECTL CTL6
        this.numstring.slice(0, 128),             // ECTL EXP1
        this.numstring.slice(0, 128),             // ECTL EXP2
        ['1', '2'],     // INOUT IN
        ['1', '2', '1&2'],     // INOUT OUT
        ['MEM', 'MAN'], // MODE MemM
        this.OffOn,     // MODE Mute
        this.OffOn,     // MODE Byps
        this.numstring.slice(0, 128),             // MIDI
        (new Array(20)).concat(this.numstring.slice(20)),             // BPM MstPBM
        this.OffOn,     // BPM Tap
        this.OffOn,     // LED MemM
        this.OffOn,     // LED Mute
        this.OffOn,     // LED Byps
        this.OffOn,     // LED BnkU
        this.OffOn,     // LED BnkD
        this.OffOn,     // LED Num1
        this.OffOn,     // LED Num2
        this.OffOn,     // LED Num3
        this.OffOn,     // LED Num4
        this.OffOn,     // LED Num5
        this.OffOn,     // LED Num6
        this.OffOn,     // LED Num7
        this.OffOn,     // LED Num8
        this.OffOn,     // Pat.M PMID1
        this.OffOn,     // Pat.M PMID2
        this.OffOn,     // Pat.M PMID3
        this.OffOn,     // Pat.M PMID4
        this.OffOn,     // Pat.M PMID5
        this.OffOn,     // Pat.M PMID6
        this.OffOn,     // Pat.M PMID7
        this.OffOn,     // Pat.M PMID8
    ];
    this.ID_PATCH_ASSIGN_TARGET_MAX = this.ID_PATCH_ASSIGN_TARGET_MIN;
    this.ID_PATCH_ASSIGN_TARGET_CC_CH = this.numstring.slice(1, 17);
    this.ID_PATCH_ASSIGN_TARGET_CC_NO = this.CC;
    this.ID_PATCH_ASSIGN_ACT_RANGE_LO = this.numstring.slice(0, 127);
    this.ID_PATCH_ASSIGN_ACT_RANGE_HI = (new Array(1)).concat(this.numstring.slice(1, 128));
    this.ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER = ['PAT', 'Exp1L', 'Exp1M', 'Exp1H', 'Exp2L', 'Exp2M', 'Exp2H', 'CTL1', 'CTL2', 'CTL3', 'CTL4', 'MemM', 'Mute', 'BnkD', 'BnkU', 'Num1', 'Num2', 'Num3', 'Num4', 'Num5', 'Num6', 'Num7', 'Num8', 'CNum', 'CC'];
    this.ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER_CC = this.CC;
    this.ID_PATCH_ASSIGN_INT_PEDAL_TIME = this.numstring.slice(0, 101);
    this.ID_PATCH_ASSIGN_INT_PEDAL_CURVE = ['LNR', 'SLW', 'FST'];
    this.ID_PATCH_ASSIGN_WAVE_PEDAL_RATE = [
        ,           //  0: reserve
        '1/1',      //  1: 全音符
        '1/2 D',    //  2: 付点2分音符
        '1/1 T',    //  3: 3連全音符
        '1/2',      //  4: 2分音符
        '1/4 D',    //  5: 付点4分音符
        '1/2 T',    //  6: 3連2分音符
        '1/4',      //  7: 4分音符
        '1/8 D',    //  8: 付点8分音符
        '1/4 T',    //  9: 3連4分音符
        '1/8',      // 10: 8分音符
        '1/16 D',   // 11: 付点16分音符
        '1/8 T',    // 12: 3連8分音符
        '1/16',     // 13: 16分音符
        ,           // 14: reserve
        ,           // 15: reserve
        ,           // 16: reserve
        ,           // 17: reserve
        ,           // 18: reserve
        ,           // 19: reserve
        ].concat(this.numstring);
    this.ID_PATCH_ASSIGN_WAVE_PEDAL_FORM = ['SAW', 'TRI', 'SINE'];

    this.PUSH_FROM = ['SYSTEM'].concat(this.patchNum);
    this.PUSH_TO   = this.PUSH_FROM;
    this.PULL_FROM = this.PUSH_FROM;
    this.PULL_TO   = this.PUSH_FROM;
};

/**
 * @brief Parameter Infomation Classの定義
 * @param   byteOff     配列先頭からのバイトオフセット
 * @param   bitOff      バイト先頭からのビットオフセット
 * @param   bit         使用ビット数
 * @param   byte        使用バイト数
 * @param   min         最大値
 * @param   max         最小値
 * @param   def         初期値
 * @param   arr         配列長
 */
function prmInfo(byteOff, bitOff, bit, byte, min, max, def, arr) {
    this.byteOff = byteOff;
    this.bitOff = bitOff;
    this.bit = bit;
    this.byte = byte;
    this.min = min;
    this.max = max;
    this.def = def;
    this.arr = arr;
}

const NUMOF_PATCH = 800;
const NUMOF_ARRAY_PC_MAP = 128;
const NUMOF_ARRAY_PC_MAP_BANK0 = NUMOF_ARRAY_PC_MAP;
const NUMOF_ARRAY_PC_MAP_BANK1 = NUMOF_ARRAY_PC_MAP;
const NUMOF_ARRAY_PC_MAP_BANK2 = NUMOF_ARRAY_PC_MAP;
const NUMOF_ARRAY_PC_MAP_BANK3 = NUMOF_ARRAY_PC_MAP;
const NUMOF_ARRAY_PC_MAP_BANK4 = NUMOF_ARRAY_PC_MAP;
const NUMOF_ARRAY_PC_MAP_BANK5 = NUMOF_ARRAY_PC_MAP;
const NUMOF_ARRAY_PC_MAP_BANK6 = NUMOF_ARRAY_PC_MAP;
const NUMOF_ARRAY_PATCH_NAME = 16;
const NUMOF_ARRAY_MIDI = 8;
const NUMOF_ARRAY_CTL = 14 + 2;
const NUMOF_ARRAY_EXP = 2;
const NUMOF_ARRAY_ASSIGN = 12;
const NUMOF_ARRAY_SW_LOOP = 9;
const NUMOF_ARRAY_LOOP_POSITION = 16 + 6;
const NUMOF_ARRAY_CARRY_OVER = NUMOF_ARRAY_SW_LOOP;

const prmdb = {
    'ID_SYSTEM_CURRENT_NUM': new prmInfo(0, 0, 10, 2, 0, 799, 0, 0),
    'ID_SYSTEM_PANEL_LOCK': new prmInfo(1, 2, 1, 1, 0, 1, 0, 0),
    'ID_SYSTEM_PLAY_OPTION_SW_MODE': new prmInfo(1, 3, 1, 1, 0, 1, 0, 0),
    'ID_SYSTEM_PLAY_OPTION_BANK_CHANGE_MODE': new prmInfo(1, 4, 1, 1, 0, 1, 0, 0),
    'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL1': new prmInfo(1, 5, 3, 1, 0, 5, 0, 0),
    'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL2': new prmInfo(2, 0, 3, 1, 0, 5, 0, 0),
    'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL3': new prmInfo(2, 3, 3, 1, 0, 5, 0, 0),
    'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL4': new prmInfo(2, 6, 3, 1, 0, 5, 0, 0),
    'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL5': new prmInfo(3, 1, 3, 1, 0, 5, 0, 0),
    'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL6': new prmInfo(3, 4, 3, 1, 0, 5, 0, 0),
    'ID_SYSTEM_PLAY_OPTION_BANK_EXTENT_MIN': new prmInfo(3, 7, 7, 1, 0, 99, 0, 0),
    'ID_SYSTEM_PLAY_OPTION_BANK_EXTENT_MAX': new prmInfo(4, 6, 7, 1, 0, 99, 99, 0),
    'ID_SYSTEM_PLAY_OPTION_PATCH_CHANGE_TIME': new prmInfo(5, 5, 4, 1, 0, 10, 0, 0),
    'ID_SYSTEM_PREFERENCE_INPUT_SELECT': new prmInfo(6, 1, 2, 1, 0, 2, 0, 0),
    'ID_SYSTEM_PREFERENCE_INPUT_BUFFER': new prmInfo(6, 3, 2, 1, 0, 2, 0, 0),
    'ID_SYSTEM_PREFERENCE_OUTPUT_SELECT': new prmInfo(6, 5, 2, 1, 0, 3, 0, 0),
    'ID_SYSTEM_PREFERENCE_OUTPUT_BUFFER': new prmInfo(6, 7, 2, 1, 0, 2, 0, 0),
    'ID_SYSTEM_PREFERENCE_LOOP7_RETURN_MODE': new prmInfo(7, 1, 1, 1, 0, 1, 1, 0),
    'ID_SYSTEM_PREFERENCE_LOOP8_RETURN_MODE': new prmInfo(7, 2, 1, 1, 0, 1, 1, 0),
    'ID_SYSTEM_PREFERENCE_VOLUME_LOOP_LIFT': new prmInfo(7, 3, 1, 1, 0, 1, 0, 0),
    'ID_SYSTEM_MIDI_SETTING_MIDI_OUT_MODE': new prmInfo(7, 4, 1, 1, 0, 1, 0, 0),
    'ID_SYSTEM_MIDI_SETTING_RX_CH': new prmInfo(7, 5, 4, 1, 0, 15, 0, 0),
    'ID_SYSTEM_MIDI_SETTING_DEVICE_ID': new prmInfo(8, 1, 5, 1, 0, 31, 0, 0),
    'ID_SYSTEM_MIDI_SETTING_SYNC_CLOCK': new prmInfo(8, 6, 1, 1, 0, 1, 1, 0),
    'ID_SYSTEM_MIDI_SETTING_CLOCK_OUT': new prmInfo(8, 7, 1, 1, 0, 1, 1, 0),
    'ID_SYSTEM_OTHERS_LCD_CONTRAST': new prmInfo(9, 0, 4, 1, 0, 9, 4, 0),
    'ID_SYSTEM_OTHERS_EXP1_POLARITY': new prmInfo(9, 4, 1, 1, 0, 1, 0, 0),
    'ID_SYSTEM_OTHERS_EXP2_POLARITY': new prmInfo(9, 5, 1, 1, 0, 1, 0, 0),
    'ID_SYSTEM_OTHERS_CTL1_POLARITY': new prmInfo(9, 6, 1, 1, 0, 1, 0, 0),
    'ID_SYSTEM_OTHERS_CTL2_POLARITY': new prmInfo(9, 7, 1, 1, 0, 1, 0, 0),
    'ID_SYSTEM_OTHERS_CTL3_POLARITY': new prmInfo(10, 0, 1, 1, 0, 1, 0, 0),
    'ID_SYSTEM_OTHERS_CTL4_POLARITY': new prmInfo(10, 1, 1, 1, 0, 1, 0, 0),
    'ID_SYSTEM_PREFERENCE_MEMORY_MANUAL_SW_MODE': new prmInfo(10, 2, 1, 1, 0, 1, 1, 0),
    'ID_SYSTEM_PREFERENCE_MUTE_BYPASS_SW_MODE': new prmInfo(10, 3, 1, 1, 0, 1, 1, 0),
    'ID_SYSTEM_MEMORY_MANUAL': new prmInfo(10, 4, 1, 1, 0, 1, 0, 0),
    'ID_SYSTEM_CTL_SW': new prmInfo(10, 5, 1, 1, 0, 1, 0, NUMOF_ARRAY_CTL),
    'ID_SYSTEM_CTL_FUNC': new prmInfo(12, 5, 5, 1, 0, 21, 0, NUMOF_ARRAY_CTL),
    'ID_SYSTEM_CTL_MIN': new prmInfo(22, 5, 1, 1, 0, 1, 0, NUMOF_ARRAY_CTL),
    'ID_SYSTEM_CTL_MAX': new prmInfo(24, 5, 1, 1, 0, 1, 1, NUMOF_ARRAY_CTL),
    'ID_SYSTEM_CTL_MOD': new prmInfo(26, 5, 1, 1, 0, 1, 0, NUMOF_ARRAY_CTL),
    'ID_SYSTEM_EXP_SW': new prmInfo(28, 5, 1, 1, 0, 1, 0, NUMOF_ARRAY_EXP),
    'ID_SYSTEM_EXP_FUNC': new prmInfo(28, 7, 2, 1, 0, 3, 0, NUMOF_ARRAY_EXP),
    'ID_SYSTEM_EXP_MIN': new prmInfo(29, 3, 9, 2, 0, 500, 0, NUMOF_ARRAY_EXP),
    'ID_SYSTEM_EXP_MAX': new prmInfo(31, 5, 9, 2, 0, 500, 127, NUMOF_ARRAY_EXP),
    'ID_SYSTEM_MANUAL_NUMBER1': new prmInfo(33, 7, 4, 1, 0, 9, 0, 0),
    'ID_SYSTEM_MANUAL_NUMBER2': new prmInfo(34, 3, 4, 1, 0, 9, 0, 0),
    'ID_SYSTEM_MANUAL_NUMBER3': new prmInfo(34, 7, 4, 1, 0, 9, 0, 0),
    'ID_SYSTEM_MANUAL_NUMBER4': new prmInfo(35, 3, 4, 1, 0, 9, 0, 0),
    'ID_SYSTEM_MANUAL_NUMBER5': new prmInfo(35, 7, 4, 1, 0, 9, 0, 0),
    'ID_SYSTEM_MANUAL_NUMBER6': new prmInfo(36, 3, 4, 1, 0, 9, 0, 0),
    'ID_SYSTEM_MANUAL_NUMBER7': new prmInfo(36, 7, 4, 1, 0, 9, 0, 0),
    'ID_SYSTEM_MANUAL_NUMBER8': new prmInfo(37, 3, 4, 1, 0, 9, 0, 0),
    'ID_SYSTEM_TEMPO_HOLD': new prmInfo(37, 7, 1, 1, 0, 1, 0, 0),
    'ID_SYSTEM_LINK': new prmInfo(38, 0, 2, 1, 0, 2, 0, 0),
    'ID_SYSTEM_PC_MAP_BANK0_PC': new prmInfo(0, 0, 10, 2, 0, 799, 0, NUMOF_ARRAY_PC_MAP_BANK0),
    'ID_SYSTEM_PC_MAP_BANK1_PC': new prmInfo(0, 0, 10, 2, 0, 799, 0, NUMOF_ARRAY_PC_MAP_BANK1),
    'ID_SYSTEM_PC_MAP_BANK2_PC': new prmInfo(0, 0, 10, 2, 0, 799, 0, NUMOF_ARRAY_PC_MAP_BANK2),
    'ID_SYSTEM_PC_MAP_BANK3_PC': new prmInfo(0, 0, 10, 2, 0, 799, 0, NUMOF_ARRAY_PC_MAP_BANK3),
    'ID_SYSTEM_PC_MAP_BANK4_PC': new prmInfo(0, 0, 10, 2, 0, 799, 0, NUMOF_ARRAY_PC_MAP_BANK4),
    'ID_SYSTEM_PC_MAP_BANK5_PC': new prmInfo(0, 0, 10, 2, 0, 799, 0, NUMOF_ARRAY_PC_MAP_BANK5),
    'ID_SYSTEM_PC_MAP_BANK6_PC': new prmInfo(0, 0, 10, 2, 0, 799, 0, NUMOF_ARRAY_PC_MAP_BANK6),
    'ID_PATCH_LOOP_SW_LOOP': new prmInfo(0, 0, 1, 1, 0, 1, 0, NUMOF_ARRAY_SW_LOOP),
    'ID_PATCH_LOOP_POSITION': new prmInfo(1, 1, 4, 1, 0, 15, 0, NUMOF_ARRAY_LOOP_POSITION),
    'ID_PATCH_MIXER_MODE': new prmInfo(12, 1, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_MIXER_GAIN1': new prmInfo(12, 2, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_MIXER_GAIN2': new prmInfo(12, 3, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_CARRY_OVER_LOOP': new prmInfo(12, 4, 1, 1, 0, 1, 0, NUMOF_ARRAY_CARRY_OVER),
    'ID_PATCH_INPUT_SELECT': new prmInfo(13, 5, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_INPUT_BUFFER': new prmInfo(13, 6, 1, 1, 0, 1, 1, 0),
    'ID_PATCH_OUTPUT_SELECT': new prmInfo(13, 7, 2, 1, 0, 2, 2, 0),
    'ID_PATCH_OUTPUT_BUFFER': new prmInfo(14, 1, 1, 1, 0, 1, 1, 0),
    'ID_PATCH_OUTPUT_GAIN': new prmInfo(14, 2, 2, 1, 0, 3, 0, 0),
    'ID_PATCH_CTL1': new prmInfo(14, 4, 9, 2, 0, 500, 0, 0),
    'ID_PATCH_CTL2': new prmInfo(15, 5, 9, 2, 0, 500, 0, 0),
    'ID_PATCH_CTL3': new prmInfo(16, 6, 9, 2, 0, 500, 0, 0),
    'ID_PATCH_CTL4': new prmInfo(17, 7, 9, 2, 0, 500, 0, 0),
    'ID_PATCH_CTL5': new prmInfo(19, 0, 9, 2, 0, 500, 0, 0),
    'ID_PATCH_CTL6': new prmInfo(20, 1, 9, 2, 0, 500, 0, 0),
    'ID_PATCH_EXP1': new prmInfo(21, 2, 8, 1, 0, 129, 128, 0),
    'ID_PATCH_EXP2': new prmInfo(22, 2, 8, 1, 0, 129, 129, 0),
    'ID_PATCH_MASTER_BPM': new prmInfo(23, 2, 9, 2, 20, 500, 120, 0),
    'ID_PATCH_NAME': new prmInfo(24, 3, 7, 1, 0x20, 0x7e, 0x20, NUMOF_ARRAY_PATCH_NAME),
    'ID_PATCH_LED_NUM1': new prmInfo(38, 3, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_LED_NUM2': new prmInfo(38, 4, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_LED_NUM3': new prmInfo(38, 5, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_LED_NUM4': new prmInfo(38, 6, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_LED_NUM5': new prmInfo(38, 7, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_LED_NUM6': new prmInfo(39, 0, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_LED_NUM7': new prmInfo(39, 1, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_LED_NUM8': new prmInfo(39, 2, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_LED_BANK_D': new prmInfo(39, 3, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_LED_BANK_U': new prmInfo(39, 4, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_MIDI_TX_CH': new prmInfo(39, 5, 5, 1, 0, 16, 0, NUMOF_ARRAY_MIDI),
    'ID_PATCH_MIDI_PC_BANK_LSB': new prmInfo(44, 5, 8, 1, 0, 128, 0, NUMOF_ARRAY_MIDI),
    'ID_PATCH_MIDI_PC_BANK_MSB': new prmInfo(52, 5, 8, 1, 0, 128, 0, NUMOF_ARRAY_MIDI),
    'ID_PATCH_MIDI_PC': new prmInfo(60, 5, 8, 1, 0, 128, 0, NUMOF_ARRAY_MIDI),
    'ID_PATCH_MIDI_CTL1_CC': new prmInfo(68, 5, 8, 1, 0, 128, 0, NUMOF_ARRAY_MIDI),
    'ID_PATCH_MIDI_CTL1_CC_VAL': new prmInfo(76, 5, 7, 1, 0, 127, 0, NUMOF_ARRAY_MIDI),
    'ID_PATCH_MIDI_CTL2_CC': new prmInfo(83, 5, 8, 1, 0, 128, 0, NUMOF_ARRAY_MIDI),
    'ID_PATCH_MIDI_CTL2_CC_VAL': new prmInfo(91, 5, 7, 1, 0, 127, 0, NUMOF_ARRAY_MIDI),
    'ID_PATCH_CTL_FUNC': new prmInfo(98, 5, 5, 1, 0, 21, 0, NUMOF_ARRAY_CTL),
    'ID_PATCH_CTL_MIN': new prmInfo(108, 5, 1, 1, 0, 1, 0, NUMOF_ARRAY_CTL),
    'ID_PATCH_CTL_MAX': new prmInfo(110, 5, 1, 1, 0, 1, 1, NUMOF_ARRAY_CTL),
    'ID_PATCH_CTL_MOD': new prmInfo(112, 5, 1, 1, 0, 1, 0, NUMOF_ARRAY_CTL),
    'ID_PATCH_EXP_FUNC': new prmInfo(114, 5, 2, 1, 0, 3, 0, NUMOF_ARRAY_EXP),
    'ID_PATCH_EXP_MIN': new prmInfo(115, 1, 9, 2, 0, 500, 0, NUMOF_ARRAY_EXP),
    'ID_PATCH_EXP_MAX': new prmInfo(117, 3, 9, 2, 0, 500, 127, NUMOF_ARRAY_EXP),
    'ID_PATCH_ASSIGN_SW': new prmInfo(119, 5, 1, 1, 0, 1, 0, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_SOURCE': new prmInfo(121, 1, 5, 1, 0, 21, 0, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_MODE': new prmInfo(128, 5, 1, 1, 0, 1, 0, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_TARGET': new prmInfo(130, 1, 6, 1, 0, 45, 0, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_TARGET_CC_CH': new prmInfo(139, 1, 4, 1, 0, 15, 0, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_TARGET_CC_NO': new prmInfo(145, 1, 7, 1, 0, 127, 80, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_TARGET_MIN': new prmInfo(155, 5, 9, 2, 0, 511, 0, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_TARGET_MAX': new prmInfo(169, 1, 9, 2, 0, 511, 0, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_ACT_RANGE_LO': new prmInfo(182, 5, 7, 1, 0, 126, 0, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_ACT_RANGE_HI': new prmInfo(193, 1, 7, 1, 1, 127, 127, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER': new prmInfo(203, 5, 5, 1, 0, 24, 0, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER_CC': new prmInfo(211, 1, 7, 1, 0, 127, 80, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_INT_PEDAL_TIME': new prmInfo(221, 5, 7, 1, 0, 100, 30, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_INT_PEDAL_CURVE': new prmInfo(232, 1, 2, 1, 0, 2, 0, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_WAVE_PEDAL_RATE': new prmInfo(235, 1, 7, 2, 1, 120, 7, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_ASSIGN_WAVE_PEDAL_FORM': new prmInfo(245, 5, 2, 1, 0, 2, 2, NUMOF_ARRAY_ASSIGN),
    'ID_PATCH_MIDI_CLOCK_OUT': new prmInfo(248, 5, 1, 1, 0, 1, 0, 0),
    'ID_PATCH_MIDI_TRANSMIT': new prmInfo(248, 6, 1, 1, 0, 1, 0, NUMOF_ARRAY_MIDI),
};

/**
 * @brief   システムパラメータの定義
 */
function system() {
    this.ID_SYSTEM_CURRENT_NUM = 0;
    this.ID_SYSTEM_PANEL_LOCK = 0;
    this.ID_SYSTEM_PLAY_OPTION_SW_MODE = 0;
    this.ID_SYSTEM_PLAY_OPTION_BANK_CHANGE_MODE = 0;
    this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL1 = 0;
    this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL2 = 0;
    this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL3 = 0;
    this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL4 = 0;
    this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL5 = 0;
    this.ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL6 = 0;
    this.ID_SYSTEM_PLAY_OPTION_BANK_EXTENT_MIN = 0;
    this.ID_SYSTEM_PLAY_OPTION_BANK_EXTENT_MAX = 99;
    this.ID_SYSTEM_PLAY_OPTION_PATCH_CHANGE_TIME = 0;
    this.ID_SYSTEM_PREFERENCE_INPUT_SELECT = 0;
    this.ID_SYSTEM_PREFERENCE_INPUT_BUFFER = 0;
    this.ID_SYSTEM_PREFERENCE_OUTPUT_SELECT = 0;
    this.ID_SYSTEM_PREFERENCE_OUTPUT_BUFFER = 0;
    this.ID_SYSTEM_PREFERENCE_LOOP7_RETURN_MODE = 1;
    this.ID_SYSTEM_PREFERENCE_LOOP8_RETURN_MODE = 1;
    this.ID_SYSTEM_PREFERENCE_VOLUME_LOOP_LIFT = 0;
    this.ID_SYSTEM_MIDI_SETTING_MIDI_OUT_MODE = 0;
    this.ID_SYSTEM_MIDI_SETTING_RX_CH = 0;
    this.ID_SYSTEM_MIDI_SETTING_DEVICE_ID = 0;
    this.ID_SYSTEM_MIDI_SETTING_SYNC_CLOCK = 1;
    this.ID_SYSTEM_MIDI_SETTING_CLOCK_OUT = 1;
    this.ID_SYSTEM_OTHERS_LCD_CONTRAST = 4;
    this.ID_SYSTEM_OTHERS_EXP1_POLARITY = 0;
    this.ID_SYSTEM_OTHERS_EXP2_POLARITY = 0;
    this.ID_SYSTEM_OTHERS_CTL1_POLARITY = 0;
    this.ID_SYSTEM_OTHERS_CTL2_POLARITY = 0;
    this.ID_SYSTEM_OTHERS_CTL3_POLARITY = 0;
    this.ID_SYSTEM_OTHERS_CTL4_POLARITY = 0;
    this.ID_SYSTEM_PREFERENCE_MEMORY_MANUAL_SW_MODE = 1;
    this.ID_SYSTEM_PREFERENCE_MUTE_BYPASS_SW_MODE = 1;
    this.ID_SYSTEM_MEMORY_MANUAL = 0;
    this.ID_SYSTEM_CTL_SW = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_SYSTEM_CTL_FUNC = [1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    this.ID_SYSTEM_CTL_MIN = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_SYSTEM_CTL_MAX = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    this.ID_SYSTEM_CTL_MOD = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_SYSTEM_EXP_SW = [0, 0];
    this.ID_SYSTEM_EXP_FUNC = [1, 2];
    this.ID_SYSTEM_EXP_MIN = [0, 0];
    this.ID_SYSTEM_EXP_MAX = [127, 127];
    this.ID_SYSTEM_MANUAL_NUMBER1 = 0;
    this.ID_SYSTEM_MANUAL_NUMBER2 = 0;
    this.ID_SYSTEM_MANUAL_NUMBER3 = 0;
    this.ID_SYSTEM_MANUAL_NUMBER4 = 0;
    this.ID_SYSTEM_MANUAL_NUMBER5 = 0;
    this.ID_SYSTEM_MANUAL_NUMBER6 = 0;
    this.ID_SYSTEM_MANUAL_NUMBER7 = 0;
    this.ID_SYSTEM_MANUAL_NUMBER8 = 0;
    this.ID_SYSTEM_TEMPO_HOLD = 0;
    this.ID_SYSTEM_LINK = 0;
    this.ID_SYSTEM_PC_MAP_BANK0_PC = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127];
    this.ID_SYSTEM_PC_MAP_BANK1_PC = [128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255];
    this.ID_SYSTEM_PC_MAP_BANK2_PC = [256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383];
    this.ID_SYSTEM_PC_MAP_BANK3_PC = [384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511];
    this.ID_SYSTEM_PC_MAP_BANK4_PC = [512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639];
    this.ID_SYSTEM_PC_MAP_BANK5_PC = [640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 696, 697, 698, 699, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 732, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743, 744, 745, 746, 747, 748, 749, 750, 751, 752, 753, 754, 755, 756, 757, 758, 759, 760, 761, 762, 763, 764, 765, 766, 767];
    this.ID_SYSTEM_PC_MAP_BANK6_PC = [768, 769, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780, 781, 782, 783, 784, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799, 799];
};

/**
 * @brief   パッチパラメータの定義
 */
function patch() {
    this.ID_PATCH_LOOP_SW_LOOP = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_LOOP_POSITION = [8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 10, 11, 12, 10, 11, 12, 13, 14, 15, 13, 14, 15];
    this.ID_PATCH_MIXER_MODE = 0;
    this.ID_PATCH_MIXER_GAIN1 = 0;
    this.ID_PATCH_MIXER_GAIN2 = 0;
    this.ID_PATCH_CARRY_OVER_LOOP = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_INPUT_SELECT = 0;
    this.ID_PATCH_INPUT_BUFFER = 1;
    this.ID_PATCH_OUTPUT_SELECT = 2;
    this.ID_PATCH_OUTPUT_BUFFER = 1;
    this.ID_PATCH_OUTPUT_GAIN = 0;
    this.ID_PATCH_CTL1 = 0;
    this.ID_PATCH_CTL2 = 0;
    this.ID_PATCH_CTL3 = 0;
    this.ID_PATCH_CTL4 = 0;
    this.ID_PATCH_CTL5 = 0;
    this.ID_PATCH_CTL6 = 0;
    this.ID_PATCH_EXP1 = 128;
    this.ID_PATCH_EXP2 = 129;
    this.ID_PATCH_MASTER_BPM = 120;
    // this.ID_PATCH_NAME = [0x42, 0x4F, 0x53, 0x53, 0x20, 0x45, 0x53, 0x2D, 0x38, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20];
    this.ID_PATCH_NAME = [0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20];
    this.ID_PATCH_LED_NUM1 = 0;
    this.ID_PATCH_LED_NUM2 = 0;
    this.ID_PATCH_LED_NUM3 = 0;
    this.ID_PATCH_LED_NUM4 = 0;
    this.ID_PATCH_LED_NUM5 = 0;
    this.ID_PATCH_LED_NUM6 = 0;
    this.ID_PATCH_LED_NUM7 = 0;
    this.ID_PATCH_LED_NUM8 = 0;
    this.ID_PATCH_LED_BANK_D = 0;
    this.ID_PATCH_LED_BANK_U = 0;
    this.ID_PATCH_MIDI_TX_CH = [0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_MIDI_PC_BANK_LSB = [0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_MIDI_PC_BANK_MSB = [0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_MIDI_PC = [0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_MIDI_CTL1_CC = [0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_MIDI_CTL1_CC_VAL = [0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_MIDI_CTL2_CC = [0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_MIDI_CTL2_CC_VAL = [0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_CTL_FUNC = [1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    this.ID_PATCH_CTL_MIN = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_CTL_MAX = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    this.ID_PATCH_CTL_MOD = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_EXP_FUNC = [1, 2];
    this.ID_PATCH_EXP_MIN = [0, 0];
    this.ID_PATCH_EXP_MAX = [127, 127];
    this.ID_PATCH_ASSIGN_SW = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_ASSIGN_SOURCE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_ASSIGN_MODE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_ASSIGN_TARGET = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_ASSIGN_TARGET_CC_CH = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_ASSIGN_TARGET_CC_NO = [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80];
    this.ID_PATCH_ASSIGN_TARGET_MIN = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_ASSIGN_TARGET_MAX = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    this.ID_PATCH_ASSIGN_ACT_RANGE_LO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_ASSIGN_ACT_RANGE_HI = [127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127];
    this.ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER_CC = [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80];
    this.ID_PATCH_ASSIGN_INT_PEDAL_TIME = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];
    this.ID_PATCH_ASSIGN_INT_PEDAL_CURVE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.ID_PATCH_ASSIGN_WAVE_PEDAL_RATE = [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7];
    this.ID_PATCH_ASSIGN_WAVE_PEDAL_FORM = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    this.ID_PATCH_MIDI_CLOCK_OUT = 0;
    this.ID_PATCH_MIDI_TRANSMIT = [0, 0, 0, 0, 0, 0, 0, 0];
};
